import React, { useState, useEffect, useCallback } from 'react';
import { Package, Truck, Box, RotateCw, Sparkles } from 'lucide-react';
import { ParcelCounts, ParcelType, PackingResult } from './types';
import { packContainer } from './services/packingService';
import { getOptimizationInsights } from './services/geminiService';
import { ControlPanel } from './components/ControlPanel';
import { StatsDisplay } from './components/StatsDisplay';
import { Visualizer } from './components/Visualizer';

const App: React.FC = () => {
  const [counts, setCounts] = useState<ParcelCounts>({
    [ParcelType.Small]: 50,
    [ParcelType.Medium]: 10,
    [ParcelType.Large]: 5,
  });

  const [priorities, setPriorities] = useState<Record<ParcelType, boolean>>({
    [ParcelType.Small]: false,
    [ParcelType.Medium]: false,
    [ParcelType.Large]: false,
  });

  const [result, setResult] = useState<PackingResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Auto-calculate on mount
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCalculate = useCallback(async () => {
    setIsCalculating(true);
    setAiInsights(null);
    
    // Small timeout to allow UI to show loading state before heavy calculation
    setTimeout(() => {
      const packingResult = packContainer(counts, priorities);
      setResult(packingResult);
      setIsCalculating(false);
    }, 100);
  }, [counts, priorities]);

  const handleAiAnalysis = async () => {
    if (!result) return;
    setLoadingAi(true);
    try {
      const insights = await getOptimizationInsights(result, counts);
      setAiInsights(insights);
    } catch (error) {
      console.error("AI Error:", error);
      setAiInsights("Unable to retrieve AI insights at this time. Please check your API key configuration.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-lg z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CLOA</h1>
              <p className="text-xs text-slate-400">Container Load Optimisation App</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold">Van Capacity: 10.26 m³</div>
            <div className="text-xs text-slate-400">3.0m x 1.8m x 1.9m</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Sidebar - Controls & Stats */}
        <div className="w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col overflow-y-auto shadow-xl z-10">
          <div className="p-6 space-y-8">
            
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center">
                <Box className="w-4 h-4 mr-2" />
                Cargo Inventory
              </h2>
              <ControlPanel 
                counts={counts} 
                setCounts={setCounts} 
                priorities={priorities}
                setPriorities={setPriorities}
                onCalculate={handleCalculate}
                isCalculating={isCalculating}
              />
            </section>

            <div className="border-t border-slate-100 my-4"></div>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center">
                <RotateCw className="w-4 h-4 mr-2" />
                Load Analysis
              </h2>
              <StatsDisplay result={result} counts={counts} />
            </section>

             <div className="border-t border-slate-100 my-4"></div>

            <section>
               <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                AI Optimisation Assistant
              </h2>
              
              {!aiInsights ? (
                <button
                  onClick={handleAiAnalysis}
                  disabled={!result || loadingAi}
                  className="w-full py-3 px-4 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-medium hover:bg-purple-100 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingAi ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-700 border-t-transparent"></div>
                      <span>Analysing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate AI Insights</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-sm text-slate-700 leading-relaxed shadow-sm">
                   <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                     <Sparkles className="w-3 h-3 mr-1" />
                     Gemini Analysis
                   </h3>
                   <div className="prose prose-sm max-w-none text-slate-600">
                     {aiInsights}
                   </div>
                   <button 
                    onClick={() => setAiInsights(null)}
                    className="mt-3 text-xs text-purple-600 hover:text-purple-800 font-medium underline"
                   >
                     Clear Analysis
                   </button>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Right Area - 3D Visualiser */}
        <div className="flex-1 bg-slate-50 relative flex flex-col">
           <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200 text-xs font-medium text-slate-600 flex items-center space-x-4">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                Small
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                Medium
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                Large
              </div>
           </div>

           <div className="flex-1 w-full h-full">
             {result ? (
               <Visualizer result={result} />
             ) : (
               <div className="h-full flex items-center justify-center text-slate-400">
                 <div className="text-center">
                   <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                   <p>Awaiting calculation...</p>
                 </div>
               </div>
             )}
           </div>
           
           <div className="p-2 bg-white border-t border-slate-200 text-xs text-slate-400 text-center">
             Interact: Left Click to Rotate • Right Click to Pan • Scroll to Zoom
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;