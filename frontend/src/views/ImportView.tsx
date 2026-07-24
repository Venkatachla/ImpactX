import React, { useState } from 'react';
import { Plus, Upload, PlayCircle, Rocket, Shield, Activity, GitBranch, Key, Info } from 'lucide-react';

export default function ImportView({ onNavigate }: { onNavigate: (path: string, mode: 'real' | 'demo') => void }) {
    const [path, setPath] = useState('');

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Import Repository</h1>
                    <p className="text-gray-600 dark:text-gray-400">Connect your source code to initialize agentic intelligence analysis.</p>
                </div>
                
                {/* Stepper */}
                <div className="flex items-center gap-4 md:gap-8 overflow-x-auto pb-2 md:pb-0">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-600 whitespace-nowrap">
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">01</span>
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-400 tracking-widest uppercase">Source</span>
                    </div>
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-transparent whitespace-nowrap">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#21262D] px-2 py-0.5 rounded">02</span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase opacity-50">Analyze</span>
                    </div>
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-transparent whitespace-nowrap">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#21262D] px-2 py-0.5 rounded">03</span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase opacity-50">Ready</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Git Repo */}
                <div className="lg:col-span-8 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl p-6 md:p-8 flex flex-col group relative overflow-hidden transition-colors hover:border-blue-500/50">
                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 pointer-events-none">
                        <GitBranch size={120} />
                    </div>
                    
                    <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center border border-blue-100 dark:border-blue-800/30">
                            <GitBranch size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Git Repository</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Connect via HTTPS, SSH, or Local Directory Path</p>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Repository Path or URL</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={path}
                                    onChange={(e) => setPath(e.target.value)}
                                    placeholder="e.g. C:/Users/rohit/Downloads/ImpactX/demo-repo or git URL"
                                    className="w-full bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363D] text-gray-900 dark:text-gray-100 rounded-lg p-3 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow pr-10"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="Specify local folder path to analyze directly.">
                                    <Info size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Branch</label>
                                <select className="w-full bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363D] text-gray-900 dark:text-gray-100 rounded-lg p-3 font-mono text-sm appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                    <option>main</option>
                                    <option>master</option>
                                    <option>develop</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Auth Method</label>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 px-2 bg-gray-100 dark:bg-[#21262D] border border-gray-200 dark:border-[#30363D] rounded-lg text-xs font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                                        <Shield size={16} /> Public / Local
                                    </button>
                                    <button className="flex-1 py-3 px-2 bg-white dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363D] hover:border-blue-500/50 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 transition-colors">
                                        <Key size={16} /> Token
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic max-w-xs text-center md:text-left">
                            Agentic analyzers will scan commit history and dependency graphs upon connection.
                        </p>
                        <button 
                            onClick={() => onNavigate(path || '.', 'real')}
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                        >
                            Connect Repository
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>

                {/* Right: Upload & Demo */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Upload */}
                    <div className="flex-1 min-h-[200px] bg-white dark:bg-[#161B22] border-2 border-dashed border-gray-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center text-center p-6 group hover:border-blue-500 transition-colors cursor-pointer">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-[#21262D] rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors mb-4">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Upload ZIP</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Drag and drop repository bundle or browse local files.</p>
                        <button className="bg-gray-100 dark:bg-[#21262D] hover:bg-gray-200 dark:hover:bg-[#30363D] border border-gray-200 dark:border-[#30363D] text-gray-900 dark:text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors">
                            Browse Files
                        </button>
                    </div>

                    {/* Demo */}
                    <div className="flex-1 min-h-[200px] bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-blue-500/5 transition-shadow flex flex-col">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl text-[10px] font-bold uppercase tracking-wider">
                            Recommended
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded flex items-center justify-center">
                                <Rocket size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Try Demo</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1">
                            Instant access to a microservices architecture sample. No configuration required.
                        </p>
                        <button 
                            onClick={() => onNavigate('demo-repo', 'demo')}
                            className="w-full bg-gray-50 dark:bg-[#21262D] hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-[#30363D] hover:border-blue-500 text-gray-900 dark:text-white py-3 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            Explore with Demo
                            <PlayCircle size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 opacity-80">
                <div className="bg-gray-50 dark:bg-[#161B22]/50 border border-gray-200 dark:border-[#30363D]/50 p-4 rounded-lg flex gap-4">
                    <Shield className="text-blue-500 shrink-0" size={24} />
                    <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Secure Intelligence</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">All code processing occurs in ephemeral containers. We do not store raw source code permanently.</p>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-[#161B22]/50 border border-gray-200 dark:border-[#30363D]/50 p-4 rounded-lg flex gap-4">
                    <Activity className="text-purple-500 shrink-0" size={24} />
                    <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Agentic Graphing</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Importing triggers the AI Change Engine to build a full dependency and impact map of your codebase.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
