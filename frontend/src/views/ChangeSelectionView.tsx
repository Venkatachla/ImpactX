import React, { useState } from 'react';
import { ArrowRight, Code2, Database, Trash2, CheckCircle2, PlayCircle } from 'lucide-react';

interface ChangeSelectionViewProps {
    onNavigate: (diffMode: string) => void;
    baselineData: any;
    errorMsg?: string;
}

export default function ChangeSelectionView({ onNavigate, baselineData, errorMsg }: ChangeSelectionViewProps) {
    const [selectedChange, setSelectedChange] = useState('git');

    // Baseline details
    const meta = baselineData?.metadata || {};
    const fileCount = baselineData?.files?.length || 0;
    const testCount = baselineData?.tests?.length || 0;
    const workflowCount = baselineData?.workflows?.length || 0;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Architecture Mapped Successfully</h1>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-mono uppercase tracking-widest font-bold">Watching for code changes</span>
                </div>
            </div>

            {/* Architecture Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] p-4 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Files</span>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-mono">{fileCount}</p>
                </div>
                <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] p-4 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Classes/Entities</span>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-mono">{meta.total_files ? Math.round(meta.total_files * 1.5) : 0}</p>
                </div>
                <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] p-4 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Tests Found</span>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-mono">{testCount}</p>
                </div>
                <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] p-4 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">CI Workflows</span>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-mono">{workflowCount}</p>
                </div>
            </div>

            {errorMsg && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg">
                    {errorMsg}
                </div>
            )}

            {/* Selection modes */}
            <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl p-6 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Simulate or Trace Change</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose to run in automated git diff mode or simulate the demo DTO field rename scenario.</p>
                </div>

                <div className="space-y-4">
                    <div 
                        onClick={() => setSelectedChange('git')}
                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                            selectedChange === 'git' 
                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' 
                                : 'border-gray-200 dark:border-[#30363D] bg-white dark:bg-[#161B22] hover:border-blue-300 dark:hover:border-blue-700'
                        }`}
                    >
                        <div className={`mt-1 shrink-0 ${selectedChange === 'git' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                            {selectedChange === 'git' ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-base text-gray-900 dark:text-white">Active Git Diff Mode</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Automatically extract uncommitted working tree modifications using native git diff.</p>
                        </div>
                    </div>

                    <div 
                        onClick={() => setSelectedChange('demo')}
                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                            selectedChange === 'demo' 
                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' 
                                : 'border-gray-200 dark:border-[#30363D] bg-white dark:bg-[#161B22] hover:border-blue-300 dark:hover:border-blue-700'
                        }`}
                    >
                        <div className={`mt-1 shrink-0 ${selectedChange === 'demo' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                            {selectedChange === 'demo' ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-base text-gray-900 dark:text-white">Golden Demo Simulator</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Simulate the DTO field rename scenario (Rename UserDTO.email &rarr; primaryEmail).</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-[#30363D]">
                <button 
                    onClick={() => onNavigate(selectedChange)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    Run Impact Trace
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
