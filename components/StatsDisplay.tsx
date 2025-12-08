import React from 'react';
import { PackingResult, ParcelType, ParcelCounts } from '../types';
import { AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';

interface Props {
  result: PackingResult | null;
  counts: ParcelCounts;
}

export const StatsDisplay: React.FC<Props> = ({ result, counts }) => {
  if (!result) return null;

  const data = [
    { name: 'Used', value: result.utilization, color: '#3b82f6' },
    { name: 'Empty', value: 100 - result.utilization, color: '#e2e8f0' },
  ];

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Packed / Total</div>
            <div className="text-xl font-bold text-slate-800">
                {result.packedParcels} <span className="text-slate-400 text-sm font-normal">/ {result.totalParcels}</span>
            </div>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Volume Used</div>
            <div className="text-xl font-bold text-slate-800">
                {result.utilization.toFixed(1)}%
            </div>
        </div>
      </div>

      {/* Utilisation Chart */}
      <div className="h-32 flex items-center space-x-4">
        <div className="flex-1 h-full relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <ReTooltip />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-slate-600">{result.utilization.toFixed(0)}%</span>
            </div>
        </div>
        <div className="flex-1 text-xs space-y-2">
            <div className="flex items-center justify-between">
                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>Small</span>
                <span className="font-mono">{counts[ParcelType.Small] - result.unplacedCount[ParcelType.Small]} / {counts[ParcelType.Small]}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>Medium</span>
                 <span className="font-mono">{counts[ParcelType.Medium] - result.unplacedCount[ParcelType.Medium]} / {counts[ParcelType.Medium]}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>Large</span>
                 <span className="font-mono">{counts[ParcelType.Large] - result.unplacedCount[ParcelType.Large]} / {counts[ParcelType.Large]}</span>
            </div>
        </div>
      </div>

      {result.packedParcels < result.totalParcels && (
          <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
             <h4 className="text-xs font-bold text-orange-700 flex items-center mb-2">
                 <AlertTriangle className="w-3 h-3 mr-1" />
                 Parcels Left Behind
             </h4>
             <div className="space-y-1 mb-2">
                {[ParcelType.Small, ParcelType.Medium, ParcelType.Large].map(type => {
                    const count = result.unplacedCount[type];
                    if (count > 0) {
                        return (
                             <div key={type} className="flex justify-between items-center text-xs text-orange-800 bg-orange-100/50 px-2 py-1 rounded">
                                <span>{type} Parcels</span>
                                <span className="font-mono font-bold text-orange-900">{count}</span>
                             </div>
                        );
                    }
                    return null;
                })}
             </div>
             <p className="text-[10px] text-orange-600 text-center border-t border-orange-200 pt-1 mt-1">
                 Total {result.totalParcels - result.packedParcels} items could not be packed.
             </p>
          </div>
      )}

    </div>
  );
};