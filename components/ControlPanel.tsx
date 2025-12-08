import React from 'react';
import { ParcelCounts, ParcelType, DIMS } from '../types';
import { Calculator, CheckSquare, Square } from 'lucide-react';

interface Props {
  counts: ParcelCounts;
  setCounts: React.Dispatch<React.SetStateAction<ParcelCounts>>;
  priorities: Record<ParcelType, boolean>;
  setPriorities: React.Dispatch<React.SetStateAction<Record<ParcelType, boolean>>>;
  onCalculate: () => void;
  isCalculating: boolean;
}

export const ControlPanel: React.FC<Props> = ({ 
  counts, 
  setCounts, 
  priorities, 
  setPriorities, 
  onCalculate, 
  isCalculating 
}) => {
  
  const handleChange = (type: ParcelType, value: string) => {
    const num = parseInt(value) || 0;
    setCounts(prev => ({ ...prev, [type]: Math.max(0, num) }));
  };

  const togglePriority = (type: ParcelType) => {
    setPriorities(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const calculateRequiredVolume = () => {
    return (
      counts[ParcelType.Small] * DIMS.SMALL.vol +
      counts[ParcelType.Medium] * DIMS.MEDIUM.vol +
      counts[ParcelType.Large] * DIMS.LARGE.vol
    );
  };

  const reqVol = calculateRequiredVolume();
  const maxVol = 10.26;
  const isOverCapacity = reqVol > maxVol;

  return (
    <div className="space-y-4">
      {[ParcelType.Small, ParcelType.Medium, ParcelType.Large].map((type) => {
          let dimsString = "";
          let colorClass = "";
          
          if(type === ParcelType.Small) {
              dimsString = "0.3 x 0.2 x 0.15m";
              colorClass = "text-green-600";
          } else if (type === ParcelType.Medium) {
              dimsString = "0.5 x 0.4 x 0.3m";
              colorClass = "text-blue-600";
          } else {
              dimsString = "0.75 x 0.5 x 0.6m";
              colorClass = "text-red-600";
          }

          const isPrioritized = priorities[type];

          return (
            <div key={type} className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-600 flex items-center">
                      <span className={`${colorClass} mr-2`}>{type} Parcel</span>
                  </label>
                  
                  <button 
                    onClick={() => togglePriority(type)}
                    className={`flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                      isPrioritized 
                        ? 'bg-amber-100 text-amber-700 border-amber-200' 
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                    title="Prioritise this parcel type during packing"
                  >
                    {isPrioritized ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                    <span>{isPrioritized ? 'Priority' : 'Normal'}</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                   <input
                    type="number"
                    min="0"
                    value={counts[type]}
                    onChange={(e) => handleChange(type, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                   />
                   <div className="text-[10px] text-slate-400 w-24 text-right leading-tight">
                     {dimsString}
                   </div>
                </div>
            </div>
          );
      })}

      {isOverCapacity && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-md flex items-start space-x-2 animate-pulse">
            <span className="text-red-500 mt-0.5">⚠️</span>
            <div className="text-xs text-red-600">
                <span className="font-bold">Volume Exceeded:</span> Total required volume ({reqVol.toFixed(2)}m³) exceeds van capacity (10.26m³). Some items will not fit.
            </div>
        </div>
      )}

      <button
        onClick={onCalculate}
        disabled={isCalculating}
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center disabled:opacity-70"
      >
        {isCalculating ? (
            <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            </span>
        ) : (
            <>
                <Calculator className="w-4 h-4 mr-2" />
                Recalculate Load
            </>
        )}
      </button>
    </div>
  );
};