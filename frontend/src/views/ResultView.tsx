import React, { useState } from 'react';
import { 
    AlertTriangle, CheckCircle, Share2, Download, Zap, 
    ArrowDown, CheckCircle2, GitCommit, Users, Server, FileCode, TestTube, PlayCircle, Info
} from 'lucide-react';
import { Badge } from '../components/Badge';
import { THEME_CLASSES } from '../lib/constants';

interface ResultViewProps {
    onNavigate: (view: string) => void;
    analysisData?: any;
    onPromote?: () => void;
}

export default function ResultView({ onNavigate, analysisData, onPromote }: ResultViewProps) {
    const [activeTab, setActiveTab] = useState('Overview');
    const [isReplaying, setIsReplaying] = useState(false);

    const handleReplay = () => {
        setIsReplaying(true);
        setTimeout(() => setIsReplaying(false), 3000);
    };

    if (!analysisData) {
        return (
            <div className="flex items-center justify-center h-full bg-white dark:bg-[#0D1117]">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading analysis results...</p>
                </div>
            </div>
        );
    }

    const data = analysisData;

    const handleCopyComment = () => {
        navigator.clipboard.writeText(data.prComment || "");
        alert("PR Comment copied to clipboard!");
    };

    if (!data.change) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-[#0D1117] p-8">
                <div className="text-center space-y-6 max-w-lg">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-[#161B22] rounded-full flex items-center justify-center text-gray-500 mx-auto">
                        <Info size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">No Local Changes Detected</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        There are no active local working tree modifications detected on disk inside the analyzed directory. 
                        Note: Local changes must be modified directly in the backend clone folder itself. If this is a freshly cloned repository, try running <strong>Analyze Latest Commit</strong> instead to compare HEAD~1.
                    </p>
                    <button 
                        onClick={() => onNavigate('select-change')}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Back to Architecture
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0D1117] min-w-0">
            {/* Header */}
            <div className="bg-gray-50 dark:bg-[#161B22] border-b border-gray-200 dark:border-[#30363D] shrink-0">
                <div className="p-6 md:px-8 md:py-6 flex flex-col md:flex-row md:items-start justify-between gap-4 max-w-7xl mx-auto">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold font-mono bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/30">LATEST COMMIT</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{data.change.file}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {data.change.changeType}: {data.change.symbol} &rarr; {data.change.newValue}
                        </h2>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1 font-mono">HEAD</span>
                            <span className="flex items-center gap-1">Git Commit Analysis</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button onClick={handleCopyComment} className="px-4 py-2 border border-gray-200 dark:border-[#30363D] text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-[#21262D] transition-colors flex items-center gap-2 text-sm font-medium">
                            <Share2 size={16} /> Copy PR Comment
                        </button>
                        <button className="px-4 py-2 border border-gray-200 dark:border-[#30363D] text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-[#21262D] transition-colors flex items-center gap-2 text-sm font-medium">
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Sub-header Stats */}
            <div className="bg-white dark:bg-[#0D1117] border-b border-gray-200 dark:border-[#30363D] shrink-0 overflow-x-auto">
                <div className="max-w-7xl mx-auto flex items-center gap-6 md:gap-8 px-6 md:px-8 py-4">
                    <div className="flex items-center gap-4 pr-6 md:pr-8 border-r border-gray-200 dark:border-[#30363D] shrink-0">
                        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle className="text-gray-100 dark:text-[#21262D]" cx="28" cy="28" fill="transparent" r="24" stroke="currentColor" strokeWidth="4"></circle>
                                <circle className="text-red-500" cx="28" cy="28" fill="transparent" r="24" stroke="currentColor" strokeDasharray="150" strokeDashoffset="19.5" strokeWidth="4"></circle>
                            </svg>
                            <span className="absolute text-sm font-bold text-red-500">{data.risk.score}</span>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{data.risk.level} Risk</h3>
                            <p className="text-xs text-gray-700 dark:text-gray-300 max-w-[200px] leading-tight">
                                {data.summary.apis > 0 ? "High-confidence API contract change." : "General source-code modification detected."}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 md:gap-8 shrink-0">
                        {[
                            { label: 'Affected Files', value: data.summary.files.toString() },
                            { label: 'Modules', value: data.summary.modules.toString() },
                            { label: 'Services', value: data.summary.services.toString() },
                            { label: 'APIs', value: data.summary.apis.toString() },
                            { label: 'Tests', value: data.summary.tests.toString() },
                            { label: 'Teams', value: data.summary.teams.toString() },
                            { label: 'CI Workflows', value: data.summary.ciWorkflows.toString() }
                        ].map(stat => (
                            <div key={stat.label} className="flex flex-col">
                                <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-[#0D1117] border-b border-gray-200 dark:border-[#30363D] shrink-0 overflow-x-auto custom-scrollbar">
                <nav className="flex max-w-7xl mx-auto px-4 md:px-8">
                    {['Overview', 'Blast Radius', 'Impacts', 'Test Plan', 'Teams & CI', 'Remediation'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-sm whitespace-nowrap border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
                                activeTab === tab 
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold' 
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            {tab}
                            {tab === 'Remediation' && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-[#0D1117]" style={{ backgroundImage: 'radial-gradient(rgba(113, 119, 133, 0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    
                    {/* TAB: OVERVIEW */}
                    {activeTab === 'Overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className={`${THEME_CLASSES.cardBg} ${THEME_CLASSES.cardBorder} rounded-xl p-6 shadow-sm`}>
                                    <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">Change Risk Score</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="text-6xl font-bold text-red-500">{data.risk.score}</div>
                                        <div className="space-y-1">
                                            <div className="text-xl font-bold text-gray-900 dark:text-white">{data.risk.level}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Confidence: {data.risk.confidence}%</div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#30363D] space-y-3">
                                        {data.risk.breakdown.map((b: any, idx: number) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">{b.factor}</span>
                                                <span className="font-mono text-gray-900 dark:text-white">+{b.score}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={`${THEME_CLASSES.cardBg} ${THEME_CLASSES.cardBorder} rounded-xl p-6 shadow-sm flex flex-col justify-center`}>
                                    <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">AI Executive Summary</h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                                        {data.aiAnalysis?.potential_issue || "AI executive summary unavailable."}
                                    </p>
                                </div>
                            </div>

                            {/* AI Change Intelligence Panel */}
                            <div className={`${THEME_CLASSES.cardBg} ${THEME_CLASSES.cardBorder} rounded-xl p-6 shadow-sm space-y-6`}>
                                <div className="border-b border-gray-200 dark:border-[#30363D] pb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI CHANGE INTELLIGENCE</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-0.5">
                                        AI-assisted reasoning based on detected code changes and dependency evidence.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">What Changed</h4>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-mono">
                                            {data.change ? `${data.change.changeType}: ${data.change.symbol} in ${data.change.file}` : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Potential Issue</h4>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {data.aiAnalysis?.potential_issue || "AI remediation unavailable."}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Why This Matters</h4>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {data.aiAnalysis?.why_it_matters || "AI remediation unavailable."}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Recommended Fix</h4>
                                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-1">
                                            {data.aiAnalysis?.recommended_fixes?.map((fix: string, idx: number) => (
                                                <div key={idx}>- {fix}</div>
                                            )) || "AI remediation unavailable."}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Testing Strategy</h4>
                                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-1">
                                            {data.aiAnalysis?.testing_strategy?.map((ts: string, idx: number) => (
                                                <div key={idx}>- {ts}</div>
                                            )) || "AI remediation unavailable."}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Safest Migration</h4>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {data.aiAnalysis?.migration_strategy || "AI remediation unavailable."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: BLAST RADIUS */}
                    {activeTab === 'Blast Radius' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
                            {/* Graph Area */}
                            <div className="lg:col-span-8 bg-[#0D1117] rounded-xl border border-gray-200 dark:border-[#30363D] relative overflow-hidden flex items-center justify-center shadow-inner">
                                <button onClick={handleReplay} className="absolute top-4 left-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold transition-colors">
                                    <PlayCircle size={16} /> Replay Blast Radius
                                </button>

                                {/* Dynamic React Flow Node representation mapping */}
                                <div className="absolute inset-0 p-6 overflow-auto flex flex-wrap content-start gap-4">
                                    {data.graph?.nodes?.slice(0, 16).map((node: any) => {
                                        const isChanged = node.status === 'changed';
                                        const isImpacted = node.status === 'impacted';
                                        return (
                                            <div 
                                                key={node.id} 
                                                className={`px-4 py-2.5 rounded-lg border-2 text-xs font-mono transition-shadow shadow-sm ${
                                                    isChanged 
                                                        ? 'border-red-500 bg-red-500/10 text-red-500 font-bold' 
                                                        : isImpacted 
                                                            ? 'border-orange-500 bg-orange-500/10 text-orange-500' 
                                                            : 'border-gray-200 dark:border-[#30363D] bg-white dark:bg-[#161B22] text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                <div className="font-bold mb-0.5">{node.type}</div>
                                                <div className="truncate max-w-[200px]">{node.data?.label || node.id}</div>
                                            </div>
                                        );
                                    })}
                                    {(!data.graph?.nodes || data.graph.nodes.length === 0) && (
                                        <div className="text-gray-500 dark:text-gray-400 text-sm m-auto">No graph nodes parsed.</div>
                                    )}
                                </div>
                            </div>

                            {/* Impact Inspector */}
                            <div className={`${THEME_CLASSES.cardBg} lg:col-span-4 rounded-xl ${THEME_CLASSES.cardBorder} flex flex-col shadow-sm`}>
                                <div className="p-4 border-b border-gray-200 dark:border-[#30363D] bg-gray-50 dark:bg-[#21262D]">
                                    <h3 className="font-bold text-gray-900 dark:text-white">Impact Inspector</h3>
                                </div>
                                <div className="p-4 flex-1 overflow-auto space-y-6">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                                            <FileCode size={20} className="text-red-500" /> {data.change.file}
                                        </h4>
                                        <Badge variant="critical">{data.risk.level} Impact</Badge>
                                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Confidence: {data.risk.confidence}%</div>
                                    </div>

                                    <div className="space-y-3">
                                        <h5 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Dependency Path</h5>
                                        <div className="bg-gray-50 dark:bg-[#0D1117] p-3 rounded-lg border border-gray-200 dark:border-[#30363D] text-sm font-mono text-gray-700 dark:text-gray-300 space-y-2">
                                            <div className="font-bold text-red-600 dark:text-red-400">{data.change.symbol} &rarr; {data.change.newValue || 'modified'}</div>
                                            {data.impacts.length > 0 ? (
                                                data.impacts.slice(0, 3).map((imp: any, i: number) => (
                                                    <React.Fragment key={i}>
                                                        <div className="text-gray-400 pl-2">&darr;</div>
                                                        <div className="pl-4">{imp.name} ({imp.type})</div>
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                <div className="text-gray-500 dark:text-gray-400 text-xs italic">No downstream dependency path detected.</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h5 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Why Affected?</h5>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {data.aiAnalysis?.potential_issue || "AI remediation unavailable."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: IMPACTS */}
                    {activeTab === 'Impacts' && (
                        <div className="space-y-6">
                            <div className={`${THEME_CLASSES.cardBg} ${THEME_CLASSES.cardBorder} rounded-xl p-6 shadow-sm`}>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Affected Components</h3>
                                <div className="space-y-3">
                                    {data.impacts.map((imp: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D]">
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white">{imp.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{imp.reason}</div>
                                            </div>
                                            <Badge variant={imp.impact.toLowerCase() as any}>{imp.impact}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: TEST PLAN */}
                    {activeTab === 'Test Plan' && (
                        <div className={`${THEME_CLASSES.cardBg} ${THEME_CLASSES.cardBorder} rounded-xl overflow-hidden shadow-sm`}>
                            <div className="p-6 border-b border-gray-200 dark:border-[#30363D] bg-gray-50 dark:bg-[#21262D]">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <TestTube size={24} className="text-blue-600 dark:text-blue-400" /> Targeted Test Plan
                                </h3>
                            </div>
                            <div className="p-6 space-y-8">
                                <div>
                                    <h4 className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <AlertTriangle size={14} /> Recommended Test Suite execution
                                    </h4>
                                    <div className="space-y-3">
                                        {data.tests.map((test: any, idx: number) => (
                                            <div key={idx} className="p-4 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D]">
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="font-mono font-bold text-gray-900 dark:text-white">{test.name}</div>
                                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{test.score}% Match</span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{test.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Info size={14} /> Missing Coverage Suggestion
                                    </h4>
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-400 mb-2 font-medium">
                                            {data.aiAnalysis.suggestedTest}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: TEAMS & CI */}
                    {activeTab === 'Teams & CI' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Teams */}
                            <div className={`${THEME_CLASSES.cardBg} ${THEME_CLASSES.cardBorder} rounded-xl p-6 shadow-sm`}>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <Users size={24} className="text-blue-600 dark:text-blue-400" /> Affected Teams
                                </h3>
                                <div className="space-y-4">
                                    {data.teams.map((t: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-red-200 dark:border-red-900/30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t.components} affected components</div>
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                <strong>Reason:</strong> {t.reason}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CI */}
                            <div className={`${THEME_CLASSES.cardBg} ${THEME_CLASSES.cardBorder} rounded-xl p-6 shadow-sm`}>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <GitCommit size={24} className="text-blue-600 dark:text-blue-400" /> CI Workflows Impacted
                                </h3>
                                <div className="space-y-4">
                                    {data.ci.map((w: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D]">
                                            <h4 className="font-mono font-bold text-gray-900 dark:text-white mb-2">{w.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                <strong>Reason:</strong> {w.reason}
                                            </p>
                                            <div className="flex gap-2">
                                                {w.jobs.map((job: string, jIdx: number) => (
                                                    <span key={jIdx} className="text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">{job}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: REMEDIATION (Fix Plan) */}
                    {activeTab === 'Remediation' && (
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            <div className="xl:col-span-8 space-y-6">
                                {/* Gemini AI Remediation Details */}
                                <div className={`${THEME_CLASSES.cardBg} ${THEME_CLASSES.cardBorder} rounded-xl p-6 shadow-sm space-y-6`}>
                                    <div className="border-b border-gray-200 dark:border-[#30363D] pb-4 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI REMEDIATION PLAN</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                AI-assisted reasoning based on detected code changes and dependency evidence.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 text-sm">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-red-600 dark:text-red-400 uppercase tracking-wider text-[11px]">Potential Issue</h4>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-red-50 dark:bg-red-950/10 p-3 rounded-lg border border-red-100 dark:border-red-950/30">
                                                {data.aiAnalysis?.potential_issue || "AI remediation unavailable."}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Why This Matters</h4>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {data.aiAnalysis?.why_it_matters || "AI remediation unavailable."}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Recommended Fix</h4>
                                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-[#161B22] p-4 rounded-lg border border-gray-200 dark:border-[#30363D] space-y-2">
                                                {data.aiAnalysis?.recommended_fixes?.map((fix: string, idx: number) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <span className="text-blue-500 font-bold">•</span>
                                                        <span>{fix}</span>
                                                    </div>
                                                )) || "AI remediation unavailable."}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Testing Strategy</h4>
                                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                                                {data.aiAnalysis?.testing_strategy?.map((ts: string, idx: number) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <span className="text-green-500 font-bold">✓</span>
                                                        <span>{ts}</span>
                                                    </div>
                                                )) || "AI remediation unavailable."}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[11px]">Safest Migration Strategy</h4>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-blue-50 dark:bg-blue-950/10 p-3 rounded-lg border border-blue-100 dark:border-blue-950/30">
                                                {data.aiAnalysis?.migration_strategy || "AI remediation unavailable."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="xl:col-span-4 flex flex-col gap-3">
                                <button onClick={onPromote} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-transform active:scale-95">
                                    <CheckCircle size={18} />
                                    Promote to Baseline Snapshot
                                </button>
                                <button onClick={handleCopyComment} className="w-full border border-gray-200 dark:border-[#30363D] bg-white dark:bg-[#161B22] py-3 rounded-lg font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#21262D] transition-colors shadow-sm">
                                    Export PR Draft
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
