// Box Dimensions (Meters)
export const DIMS = {
    SMALL: { l: 0.30, w: 0.20, h: 0.15, vol: 0.009, color: '#22c55e', name: 'Small' },
    MEDIUM: { l: 0.50, w: 0.40, h: 0.30, vol: 0.06, color: '#3b82f6', name: 'Medium' },
    LARGE: { l: 0.75, w: 0.50, h: 0.60, vol: 0.225, color: '#ef4444', name: 'Large' },
};

// Container Dimensions (Meters)
// L=3.0, W=1.8, H=1.9
// Note: In 3D engine (Three.js), usually Y is Up. 
// We will map Logistics (L, W, H) -> Three.js (x, z, y) or similar.
// Let's standardise: 
// X = Length (3.0)
// Y = Height (1.9)
// Z = Width (1.8)
export const CONTAINER = {
    x: 3.0,
    y: 1.9,
    z: 1.8,
    vol: 10.26
};

export enum ParcelType {
    Small = 'Small',
    Medium = 'Medium',
    Large = 'Large'
}

export interface ParcelCounts {
    [ParcelType.Small]: number;
    [ParcelType.Medium]: number;
    [ParcelType.Large]: number;
}

export interface PlacedItem {
    id: string;
    type: ParcelType;
    position: [number, number, number]; // x, y, z (bottom-left corner)
    dimensions: [number, number, number]; // width, height, depth (after rotation)
    color: string;
}

export interface PackingResult {
    placedItems: PlacedItem[];
    unplacedCount: {
        [ParcelType.Small]: number;
        [ParcelType.Medium]: number;
        [ParcelType.Large]: number;
    };
    totalVolume: number;
    usedVolume: number;
    utilization: number;
    totalParcels: number;
    packedParcels: number;
}
