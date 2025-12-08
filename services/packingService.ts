import { ParcelCounts, ParcelType, DIMS, CONTAINER, PackingResult, PlacedItem } from '../types';

// Simple definition of a 3D point
interface Point3D {
    x: number;
    y: number;
    z: number;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const packContainer = (
    counts: ParcelCounts, 
    priorities?: Record<ParcelType, boolean>
): PackingResult => {
    // 1. Prepare items list
    let itemsToPack: any[] = [];
    
    // Add Small items
    for (let i = 0; i < counts[ParcelType.Small]; i++) {
        itemsToPack.push({ ...DIMS.SMALL, type: ParcelType.Small, id: generateId() });
    }
    // Add Medium items
    for (let i = 0; i < counts[ParcelType.Medium]; i++) {
        itemsToPack.push({ ...DIMS.MEDIUM, type: ParcelType.Medium, id: generateId() });
    }
    // Add Large items
    for (let i = 0; i < counts[ParcelType.Large]; i++) {
        itemsToPack.push({ ...DIMS.LARGE, type: ParcelType.Large, id: generateId() });
    }

    // Sort items logic
    // 1. Priority (True first)
    // 2. Volume DESC
    // 3. Max Dimension DESC
    itemsToPack.sort((a, b) => {
        const pA = priorities && priorities[a.type as ParcelType] ? 1 : 0;
        const pB = priorities && priorities[b.type as ParcelType] ? 1 : 0;
        
        if (pA !== pB) {
            return pB - pA; // Higher priority first
        }

        return b.vol - a.vol || Math.max(b.l, b.w, b.h) - Math.max(a.l, a.w, a.h);
    });

    const placedItems: PlacedItem[] = [];
    const unplacedCount = {
        [ParcelType.Small]: 0,
        [ParcelType.Medium]: 0,
        [ParcelType.Large]: 0,
    };

    // Candidate Points (Potential placement coordinates)
    // Start with origin
    let candidatePoints: Point3D[] = [{ x: 0, y: 0, z: 0 }];

    // Helper: Check if box at position with dimensions overlaps with any placed item
    const intersects = (pos: Point3D, dims: {l: number, w: number, h: number}) => {
        // Current box bounds
        const x1 = pos.x;
        const y1 = pos.y;
        const z1 = pos.z;
        const x2 = pos.x + dims.l;
        const y2 = pos.y + dims.h;
        const z2 = pos.z + dims.w;

        // Check against container bounds
        // Floating point tolerance epsilon
        const EPS = 0.001;
        if (x2 > CONTAINER.x + EPS || y2 > CONTAINER.y + EPS || z2 > CONTAINER.z + EPS) return true;

        // Check against placed items
        for (const item of placedItems) {
            const ix1 = item.position[0];
            const iy1 = item.position[1];
            const iz1 = item.position[2];
            const ix2 = ix1 + item.dimensions[0];
            const iy2 = iy1 + item.dimensions[1];
            const iz2 = iz1 + item.dimensions[2];

            // AABB Intersection test
            const noOverlap = 
                x2 <= ix1 + EPS || 
                x1 >= ix2 - EPS || 
                y2 <= iy1 + EPS || 
                y1 >= iy2 - EPS || 
                z2 <= iz1 + EPS || 
                z1 >= iz2 - EPS;

            if (!noOverlap) return true;
        }

        return false;
    };

    // 6 Rotations for a box (l, w, h permutations)
    const getRotations = (item: typeof DIMS.SMALL) => {
        const { l, w, h } = item;
        return [
            { l: l, w: w, h: h }, // Standard
            { l: l, w: h, h: w },
            { l: w, w: l, h: h },
            { l: w, w: h, h: l },
            { l: h, w: l, h: w },
            { l: h, w: w, h: l }
        ];
    };

    // Main Loop
    for (const item of itemsToPack) {
        let placed = false;
        
        // Sort candidate points: Back-Bottom-Left preference (Y -> Z -> X or Y -> X -> Z)
        // Here we prefer stacking bottom up (Y), then back-to-front (Z), then left-to-right (X)
        candidatePoints.sort((a, b) => {
            if (a.y !== b.y) return a.y - b.y;
            if (a.z !== b.z) return a.z - b.z;
            return a.x - b.x;
        });

        // Try to place at every candidate point
        for (let i = 0; i < candidatePoints.length; i++) {
            const point = candidatePoints[i];
            const rotations = getRotations(item);
            
            // Try all rotations
            for (const rot of rotations) {
                // Dimensions in our coordinate system:
                // l maps to x, h maps to y, w maps to z based on our standard in types.ts
                
                // Effective dimensions for this rotation
                // We treat rot.l as width along X, rot.h as height along Y, rot.w as depth along Z
                const effectiveDims = { l: rot.l, h: rot.h, w: rot.w }; 

                if (!intersects(point, effectiveDims)) {
                    // Place it!
                    placedItems.push({
                        id: item.id,
                        type: item.type,
                        position: [point.x, point.y, point.z],
                        dimensions: [effectiveDims.l, effectiveDims.h, effectiveDims.w], // x, y, z size
                        color: item.color
                    });

                    // Add new candidate points relative to this box
                    // 1. Right of box
                    candidatePoints.push({ x: point.x + effectiveDims.l, y: point.y, z: point.z });
                    // 2. Top of box
                    candidatePoints.push({ x: point.x, y: point.y + effectiveDims.h, z: point.z });
                    // 3. Front of box
                    candidatePoints.push({ x: point.x, y: point.y, z: point.z + effectiveDims.w });

                    // Optimisation: Filter out points that are obviously invalid or contained in others?
                    // For a simple prototype, we just remove points that are now inside the newly placed box
                    candidatePoints = candidatePoints.filter(p => !intersects({x: p.x, y: p.y, z: p.z}, {l:0, w:0, h:0})); 
                    
                    placed = true;
                    break;
                }
            }
            if (placed) break;
        }

        if (!placed) {
            unplacedCount[item.type as ParcelType]++;
        }
    }

    const totalVolume = CONTAINER.x * CONTAINER.y * CONTAINER.z;
    const usedVolume = placedItems.reduce((acc, item) => acc + (item.dimensions[0] * item.dimensions[1] * item.dimensions[2]), 0);

    return {
        placedItems,
        unplacedCount,
        totalVolume,
        usedVolume,
        utilization: (usedVolume / totalVolume) * 100,
        totalParcels: itemsToPack.length,
        packedParcels: placedItems.length
    };
};