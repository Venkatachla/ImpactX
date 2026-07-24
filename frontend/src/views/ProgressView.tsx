import React, { useEffect, useState } from 'react';
import { CheckCircle2, RefreshCw, Circle, Network, Search, Filter, Brain } from 'lucide-react';

export default function ProgressView({ onNavigate }: { onNavigate: (view: string) => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => Math.min(p + (Math.random() * 2), 98));
        }, 500);
        
        // Auto navigate to results after simulated analysis time
        const timeout = setTimeout(() => {
            onNavigate('results');
        }, 4000);
        
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [onNavigate]);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0D1117]">
            {/* Header Area */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-[#30363D]">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                        <RefreshCw className="animate-spin" size={16} />
                        <span className="text-[10px] font-bold tracking-widest uppercase">Analysis In Progress</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Analyzing <span className="text-blue-600 dark:text-blue-400">commerce-platform</span>
                    </h1>
                </div>
                
                {/* Global Progress Bar */}
                <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                    <div className="flex flex-col md:items-end">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Building knowledge graph...</span>
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Est. remaining: 4m 22s</span>
                    </div>
                    <div className="hidden md:block w-48 h-1.5 bg-gray-100 dark:bg-[#21262D] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <button 
                        onClick={() => onNavigate('dashboard')}
                        className="px-4 py-2 border border-gray-200 dark:border-[#30363D] text-gray-600 dark:text-gray-400 text-sm font-bold rounded-lg hover:text-red-600 hover:border-red-600 transition-colors ml-auto md:ml-0"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onNavigate('results')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors ml-2"
                    >
                        Skip to Results
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 md:p-8 min-h-0">
                {/* Left Column: Pipeline & Stats */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0 overflow-y-auto">
                    {/* Pipeline Execution Box */}
                    <div className="bg-gray-50 dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl overflow-hidden flex flex-col shrink-0">
                        <div className="p-4 border-b border-gray-200 dark:border-[#30363D] relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 animate-pulse"></div>
                            <h2 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-2">Pipeline Execution</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-orange-600 dark:text-orange-500 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Repository imported</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Origin: main branch</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-orange-600 dark:text-orange-500 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">1,247 source files discovered</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Types: .ts, .go, .java, .proto</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-orange-600 dark:text-orange-500 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Languages detected</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Polyglot environment identified</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 relative">
                                <div className="absolute left-2.5 top-5 bottom-[-16px] w-px bg-gray-200 dark:bg-[#30363D]"></div>
                                <Circle className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 fill-blue-100 dark:fill-blue-900/30 border-blue-600" size={20} />
                                <div className="w-full">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Extracting classes and methods...</p>
                                    <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-[#21262D] rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500" style={{ width: '66%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 opacity-40 pt-4">
                                <Circle className="text-gray-400 shrink-0 mt-0.5" size={20} />
                                <p className="text-sm text-gray-900 dark:text-white">Mapping dependencies</p>
                            </div>
                            <div className="flex items-start gap-3 opacity-40">
                                <Circle className="text-gray-400 shrink-0 mt-0.5" size={20} />
                                <p className="text-sm text-gray-900 dark:text-white">Discovering API contracts</p>
                            </div>
                            <div className="flex items-start gap-3 opacity-40">
                                <Circle className="text-gray-400 shrink-0 mt-0.5" size={20} />
                                <p className="text-sm text-gray-900 dark:text-white">Mapping tests</p>
                            </div>
                            <div className="flex items-start gap-3 opacity-40">
                                <Circle className="text-gray-400 shrink-0 mt-0.5" size={20} />
                                <p className="text-sm text-gray-900 dark:text-white">Building knowledge graph</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 shrink-0">
                        <div className="bg-gray-50 dark:bg-[#161B22]/50 border border-gray-200 dark:border-[#30363D] p-4 rounded-lg flex flex-col justify-between">
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Files</span>
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">1,247</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#161B22]/50 border border-gray-200 dark:border-[#30363D] p-4 rounded-lg flex flex-col justify-between">
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Classes</span>
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">312</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#161B22]/50 border border-gray-200 dark:border-[#30363D] p-4 rounded-lg flex flex-col justify-between">
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Methods</span>
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">1,840</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#161B22]/50 border border-gray-200 dark:border-[#30363D] p-4 rounded-lg flex flex-col justify-between">
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">API Endpoints</span>
                            <span className="text-xl font-bold text-gray-600 dark:text-gray-300 font-mono">42</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visualization */}
                <div className="lg:col-span-8 bg-gray-50 dark:bg-[#161B22] rounded-xl border border-gray-200 dark:border-[#30363D] flex flex-col overflow-hidden min-h-[400px]">
                    <div className="p-4 border-b border-gray-200 dark:border-[#30363D] flex justify-between items-center bg-white dark:bg-[#0D1117]">
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Real-time Logic Mapping</span>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 opacity-50"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 opacity-50"></div>
                        </div>
                    </div>
                    
                    {/* Mock Graph Area */}
                    <div className="flex-1 relative bg-white dark:bg-[#0D1117] overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8B5CF6 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                        
                        {/* Central Node */}
                        <div className="relative z-10 w-24 h-24 rounded-full border border-blue-200 dark:border-blue-900/50 bg-white/80 dark:bg-[#161B22]/80 backdrop-blur-sm flex flex-col items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                            <Brain className="text-blue-600 dark:text-blue-400 mb-1 animate-pulse" size={32} />
                            <span className="text-[8px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center">Core<br/>Intelligence</span>
                        </div>
                        
                        {/* Connecting Lines (Simulated with absolute positioning) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40">
                            <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="#2563eb" strokeWidth="1" strokeDasharray="4 4" className="animate-pulse" />
                            <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="#2563eb" strokeWidth="1" strokeDasharray="4 4" className="animate-pulse" />
                            <line x1="50%" y1="50%" x2="70%" y2="80%" stroke="#2563eb" strokeWidth="1" strokeDasharray="4 4" className="animate-pulse" />
                            <line x1="50%" y1="50%" x2="30%" y2="70%" stroke="#2563eb" strokeWidth="1" strokeDasharray="4 4" className="animate-pulse" />
                        </svg>
                        
                        {/* Satellite Nodes */}
                        <div className="absolute top-[20%] left-[20%] w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-ping" style={{animationDuration: '3s'}}></div>
                        <div className="absolute top-[30%] right-[20%] w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] animate-ping" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></div>
                        <div className="absolute bottom-[20%] right-[30%] w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
                        <div className="absolute bottom-[30%] left-[30%] w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] animate-ping" style={{animationDuration: '3.5s', animationDelay: '0.2s'}}></div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-[#161B22] border-t border-gray-200 dark:border-[#30363D] flex flex-col md:flex-row md:items-center gap-4">
                        <code className="text-xs font-mono text-gray-600 dark:text-gray-300 bg-white dark:bg-[#0D1117] px-2 py-1 rounded shrink-0">DEBUG: MAP_RESOLVER_INIT_STAGE_4</code>
                        <div className="text-xs text-gray-500 dark:text-gray-400 italic">Scanning architecture for side effects...</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
