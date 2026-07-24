import React from 'react';
import { Plus, Upload, FileText, CheckCircle2, ArrowRight, Brain } from 'lucide-react';
import { Badge } from '../components/Badge';
import { THEME_CLASSES, RECENT_ANALYSES_STATS, SUMMARY_STATS, RECENT_ANALYSES } from '../lib/constants';

export default function DashboardView({ onNavigate }: { onNavigate: (view: string) => void }) {
    return (
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Good morning. Understand the impact before you ship the change.</h2>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                        <span className="text-[10px] font-mono uppercase tracking-widest">System Status: Analysis Engine Active</span>
                    </div>
                </div>
                <button 
                    onClick={() => onNavigate('import')}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    New Analysis
                </button>
            </div>

            {/* Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className={`lg:col-span-8 ${THEME_CLASSES.cardBg} ${THEME_CLASSES.cardBorder} p-8 rounded-xl relative overflow-hidden group`}>
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #8B5CF6 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Analyze your next change</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-xl leading-relaxed">
                            Run deep dependency analysis, predict regression risks, and understand side effects across your entire microservices architecture before opening a PR.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => onNavigate('import')}
                                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                            >
                                <Upload size={20} />
                                [ + Analyze Repository ]
                            </button>
                            <button 
                                onClick={() => onNavigate('progress')}
                                className="flex items-center justify-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                Try Demo Repository
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`lg:col-span-4 ${THEME_CLASSES.cardBg} ${THEME_CLASSES.cardBorder} p-6 rounded-xl flex flex-col justify-between`}>
                    <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">Change Risk Distribution</h4>
                    <div className="space-y-4">
                        {RECENT_ANALYSES_STATS.map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{stat.value}%</span>
                                </div>
                                <div className={`h-1.5 w-full ${THEME_CLASSES.subtleBg} rounded-full overflow-hidden`}>
                                    <div className={`h-full ${stat.color}`} style={{ width: `${stat.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`mt-6 pt-4 ${THEME_CLASSES.cardBorder} border-t-1 border-x-0 border-b-0`}>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Based on last <span className="font-bold text-gray-900 dark:text-white">124 analyses</span></p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {SUMMARY_STATS.map((stat, i) => (
                    <div key={i} className={`${THEME_CLASSES.cardBg} ${THEME_CLASSES.cardBorder} p-4 rounded-xl flex flex-col justify-between`}>
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{stat.label}</span>
                        <div className="flex items-end justify-between mt-2">
                            <span className={`text-3xl font-bold ${stat.alert ? 'text-red-500' : stat.success ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                {stat.value}
                            </span>
                            {stat.alert && <svg className="w-6 h-6 text-red-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                            {stat.success && <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-1" />}
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-[#30363D] flex justify-between items-center">
                    <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Recent Analyses</h4>
                    <button className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">View History</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className={`${THEME_CLASSES.subtleBg}/50`}>
                                <th className={`px-6 py-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ${THEME_CLASSES.cardBorder} border-t-0 border-x-0 border-b-1`}>Analysis</th>
                                <th className={`px-6 py-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ${THEME_CLASSES.cardBorder} border-t-0 border-x-0 border-b-1`}>Project</th>
                                <th className={`px-6 py-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ${THEME_CLASSES.cardBorder} border-t-0 border-x-0 border-b-1`}>Change</th>
                                <th className={`px-6 py-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ${THEME_CLASSES.cardBorder} border-t-0 border-x-0 border-b-1 text-center`}>Risk</th>
                                <th className={`px-6 py-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ${THEME_CLASSES.cardBorder} border-t-0 border-x-0 border-b-1`}>Impacted</th>
                                <th className={`px-6 py-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ${THEME_CLASSES.cardBorder} border-t-0 border-x-0 border-b-1`}>Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-[#30363D]">
                            {RECENT_ANALYSES.map((item) => (
                                <tr key={item.id} className={`${THEME_CLASSES.hoverBg} transition-colors cursor-pointer group`} onClick={() => onNavigate(item.targetView)}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-blue-600 dark:text-blue-400" size={18} />
                                            <span className="font-bold text-gray-900 dark:text-white">{item.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 ${THEME_CLASSES.subtleBg} ${THEME_CLASSES.cardBorder} rounded text-xs font-mono text-gray-900 dark:text-gray-300`}>{item.project}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.changeType}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant={item.riskVariant}>{item.riskLabel}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{item.impactedFiles}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dynamic Agent Insight Card */}
            <div className="bg-white/80 dark:bg-[#161B22]/80 backdrop-blur-sm border border-blue-200 dark:border-blue-900/50 p-6 rounded-xl relative group shadow-sm">
                <div className="flex items-start gap-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800/40 relative shrink-0">
                        <Brain className="text-blue-600 dark:text-blue-400 w-8 h-8" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                        </span>
                    </div>
                    <div className="space-y-3 flex-1">
                        <div className="flex justify-between items-start">
                            <h5 className="text-lg font-bold text-blue-600 dark:text-blue-400">Intelligent Observation</h5>
                            <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#30363D] px-2 py-0.5 rounded">AGENT V4.2</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl">
                            Based on your recent <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1 rounded">Authentication Refactor</span>, I've detected a 15% increase in potential circular dependencies in the <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1 rounded">commerce-api</span>. Consider decoupling the <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1 rounded">AuthMiddleware</span> before shipping this to production.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <button 
                                onClick={() => onNavigate('results')}
                                className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline flex items-center gap-1"
                            >
                                Run Deep Trace <ArrowRight size={14} />
                            </button>
                            <button className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white transition-colors">Dismiss</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
