import React, { useState } from 'react';
import { 
    AlertTriangle, CheckCircle, Share2, Download, Zap, 
    ArrowDown, CheckCircle2, GitCommit, Users, Server, FileCode, TestTube, PlayCircle, Info
} from 'lucide-react';
import { Badge } from '../components/Badge';

export default function ResultView({ onNavigate }: { onNavigate: (view: string) => void }) {
    const [activeTab, setActiveTab] = useState('Overview');
    const [isReplaying, setIsReplaying] = useState(false);

    const handleReplay = () => {
        setIsReplaying(true);
        setTimeout(() => setIsReplaying(false), 3000);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0D1117] min-w-0">
            {/* Header */}
            <div className="bg-gray-50 dark:bg-[#161B22] border-b border-gray-200 dark:border-[#30363D] shrink-0">
                <div className="p-6 md:px-8 md:py-6 flex flex-col md:flex-row md:items-start justify-between gap-4 max-w-7xl mx-auto">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold font-mono bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/30">MERGE REQUEST #482</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">commerce-platform / main</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">UserDTO Field Rename</h2>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">Analyzed just now</span>
                            <span className="flex items-center gap-1">CI/CD Bot</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button className="px-4 py-2 border border-gray-200 dark:border-[#30363D] text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-[#21262D] transition-colors flex items-center gap-2 text-sm font-medium">
                            <Share2 size={16} /> Share
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
                            <span className="absolute text-sm font-bold text-red-500">87</span>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Critical Risk</h3>
                            <p className="text-xs text-gray-700 dark:text-gray-300 max-w-[200px] leading-tight">High-confidence API contract change.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 md:gap-8 shrink-0">
                        {[
                            { label: 'Files', value: '12' },
                            { label: 'Modules', value: '4' },
                            { label: 'Services', value: '3' },
                            { label: 'APIs', value: '2' },
                            { label: 'Tests', value: '6' },
                            { label: 'Teams', value: '2' },
                            { label: 'CI Workflows', value: '2' }
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
                                <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl p-6 shadow-sm">
                                    <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">Change Risk Score</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="text-6xl font-bold text-red-500">87</div>
                                        <div className="space-y-1">
                                            <div className="text-xl font-bold text-gray-900 dark:text-white">CRITICAL</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Confidence: 94%</div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#30363D] space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">DTO/API breaking change</span>
                                            <span className="font-mono text-gray-900 dark:text-white">+25</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Public API exposure</span>
                                            <span className="font-mono text-gray-900 dark:text-white">+20</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Direct dependencies</span>
                                            <span className="font-mono text-gray-900 dark:text-white">+15</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl p-6 shadow-sm flex flex-col justify-center">
                                    <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">AI Executive Summary</h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                                        The rename of <code className="bg-gray-100 dark:bg-[#0D1117] px-1 py-0.5 rounded text-red-600 dark:text-red-400">UserDTO.email</code> to <code className="bg-gray-100 dark:bg-[#0D1117] px-1 py-0.5 rounded text-green-600 dark:text-green-400">UserDTO.primaryEmail</code> propagates through 3 backend services and breaks 2 public API endpoints. This change will directly cause runtime undefined errors in <span className="font-mono text-xs font-bold">ProfilePage.tsx</span> on the frontend. Two CI workflows require updates, and both the Identity and Frontend teams must review.
                                    </p>
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

                                {/* Mock Graph */}
                                <div className={`relative w-full h-full flex flex-col items-center justify-center gap-12 ${isReplaying ? 'animate-pulse' : ''}`}>
                                    <div className="text-center z-10 relative">
                                        <div className="bg-white dark:bg-[#161B22] border-2 border-red-500 rounded-xl px-4 py-2 shadow-lg shadow-red-500/20">
                                            <span className="font-bold text-gray-900 dark:text-white">UserDTO</span>
                                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-16 z-10 relative">
                                        <div className="bg-white dark:bg-[#161B22] border border-red-500 rounded-xl px-4 py-2 text-center opacity-90">
                                            <span className="font-bold text-gray-900 dark:text-white">UserService</span>
                                        </div>
                                        <div className="bg-white dark:bg-[#161B22] border border-red-500 rounded-xl px-4 py-2 text-center relative shadow-lg shadow-red-500/20">
                                            <span className="font-bold text-gray-900 dark:text-white">UserController</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-16 z-10 relative">
                                        <div className="bg-white dark:bg-[#161B22] border border-orange-500 rounded-xl px-4 py-2 text-center opacity-80">
                                            <span className="font-bold text-gray-900 dark:text-white">AuthService</span>
                                        </div>
                                        <div className="bg-white dark:bg-[#161B22] border border-red-500 rounded-xl px-4 py-2 text-center relative shadow-lg shadow-red-500/20">
                                            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">GET /api/users</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-8 z-10 relative">
                                        <div className="bg-white dark:bg-[#161B22] border-2 border-red-500 rounded-xl px-4 py-2 text-center shadow-[0_0_20px_rgba(239,68,68,0.3)] transform scale-110">
                                            <span className="font-bold text-gray-900 dark:text-white">ProfilePage.tsx</span>
                                        </div>
                                    </div>

                                    {/* Lines */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                                        <line x1="50%" y1="20%" x2="40%" y2="40%" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
                                        <line x1="50%" y1="20%" x2="60%" y2="40%" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
                                        <line x1="40%" y1="45%" x2="40%" y2="65%" stroke="#f97316" strokeWidth="2" strokeDasharray="4" />
                                        <line x1="60%" y1="45%" x2="60%" y2="65%" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
                                        <line x1="60%" y1="70%" x2="50%" y2="90%" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
                                    </svg>
                                </div>
                            </div>

                            {/* Impact Inspector */}
                            <div className="lg:col-span-4 bg-white dark:bg-[#161B22] rounded-xl border border-gray-200 dark:border-[#30363D] flex flex-col shadow-sm">
                                <div className="p-4 border-b border-gray-200 dark:border-[#30363D] bg-gray-50 dark:bg-[#21262D]">
                                    <h3 className="font-bold text-gray-900 dark:text-white">Impact Inspector</h3>
                                </div>
                                <div className="p-4 flex-1 overflow-auto space-y-6">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                                            <FileCode size={20} className="text-red-500" /> ProfilePage.tsx
                                        </h4>
                                        <Badge variant="critical">Critical Impact</Badge>
                                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Confidence: 96%</div>
                                    </div>

                                    <div className="space-y-3">
                                        <h5 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Dependency Path</h5>
                                        <div className="bg-gray-50 dark:bg-[#0D1117] p-3 rounded-lg border border-gray-200 dark:border-[#30363D] text-sm font-mono text-gray-700 dark:text-gray-300 space-y-2">
                                            <div>UserDTO.email</div>
                                            <div className="pl-2 text-gray-400">↓</div>
                                            <div className="pl-4">UserController</div>
                                            <div className="pl-6 text-gray-400">↓</div>
                                            <div className="pl-8 text-blue-600 dark:text-blue-400">GET /api/users/{'{'}id{'}'}</div>
                                            <div className="pl-10 text-gray-400">↓</div>
                                            <div className="pl-12 font-bold text-red-600 dark:text-red-400">ProfilePage.tsx</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h5 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Why Affected?</h5>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Frontend expects <code className="bg-gray-100 dark:bg-[#0D1117] px-1 rounded">user.email</code> from the API, but the new contract exposes <code className="bg-gray-100 dark:bg-[#0D1117] px-1 rounded">user.primaryEmail</code>. This will result in an undefined error at runtime.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: IMPACTS */}
                    {activeTab === 'Impacts' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Affected Services</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D]">
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white">UserService</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Direct dependency</div>
                                        </div>
                                        <Badge variant="critical">Critical</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D]">
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white">AuthService</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Transitive dependency</div>
                                        </div>
                                        <Badge variant="high">High</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D]">
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white">NotificationService</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Consumes changed user data</div>
                                        </div>
                                        <Badge variant="medium">Medium</Badge>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">API Contract Impact</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D] border-l-4 border-l-red-500">
                                        <div>
                                            <div className="font-mono text-sm font-bold text-gray-900 dark:text-white">GET /api/users/{'{'}id{'}'}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Returns UserDTO schema</div>
                                        </div>
                                        <Badge variant="critical">Contract at Risk</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D] border-l-4 border-l-red-500">
                                        <div>
                                            <div className="font-mono text-sm font-bold text-gray-900 dark:text-white">PUT /api/users/{'{'}id{'}'}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Accepts UserDTO schema</div>
                                        </div>
                                        <Badge variant="critical">Contract at Risk</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: TEST PLAN */}
                    {activeTab === 'Test Plan' && (
                        <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-gray-200 dark:border-[#30363D] bg-gray-50 dark:bg-[#21262D]">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <TestTube size={24} className="text-blue-600 dark:text-blue-400" /> Targeted Test Plan
                                </h3>
                            </div>
                            <div className="p-6 space-y-8">
                                <div>
                                    <h4 className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <AlertTriangle size={14} /> Must Run (Critical Path)
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="p-4 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D]">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="font-mono font-bold text-gray-900 dark:text-white">UserControllerTest</div>
                                                <span className="text-sm font-bold text-green-600 dark:text-green-400">98% Match</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Directly tests the affected controller layer.</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D]">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="font-mono font-bold text-gray-900 dark:text-white">UserServiceTest</div>
                                                <span className="text-sm font-bold text-green-600 dark:text-green-400">92% Match</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Tests direct dependency of the changed DTO.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <CheckCircle size={14} /> Recommended
                                    </h4>
                                    <div className="p-4 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D]">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="font-mono font-bold text-gray-900 dark:text-white">AuthIntegrationTest</div>
                                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">81% Match</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Exercises the affected user authentication API flow.</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Info size={14} /> Missing Coverage
                                    </h4>
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-400 mb-2 font-medium">
                                            No test verifies backward compatibility of the "email" response field.
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <strong>Suggested Test:</strong> Verify API response compatibility to ensure legacy clients do not break during rollout.
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
                            <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl p-6 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <Users size={24} className="text-blue-600 dark:text-blue-400" /> Affected Teams
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-red-200 dark:border-red-900/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                            <h4 className="font-bold text-gray-900 dark:text-white">Identity Team</h4>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">5 affected components • 2 critical impacts</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>Reason:</strong> Owns <code className="bg-white dark:bg-[#161B22] px-1 rounded">UserDTO</code> and <code className="bg-white dark:bg-[#161B22] px-1 rounded">UserController</code>.
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-orange-200 dark:border-orange-900/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                            <h4 className="font-bold text-gray-900 dark:text-white">Frontend Team</h4>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">2 affected components</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>Reason:</strong> Consumes affected user API in Profile features.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CI */}
                            <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl p-6 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <GitCommit size={24} className="text-blue-600 dark:text-blue-400" /> CI Workflows Impacted
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D]">
                                        <h4 className="font-mono font-bold text-gray-900 dark:text-white mb-2">backend-ci.yml</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            <strong>Reason:</strong> Backend DTO/API changed.
                                        </p>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">Build</span>
                                            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">Unit Tests</span>
                                            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">Integration</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D]">
                                        <h4 className="font-mono font-bold text-gray-900 dark:text-white mb-2">frontend-ci.yml</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            <strong>Reason:</strong> Frontend consumes affected API.
                                        </p>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">Frontend Build</span>
                                            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">Contract Tests</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: REMEDIATION (Fix Plan) */}
                    {activeTab === 'Remediation' && (
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            <div className="xl:col-span-8 space-y-6">
                                {/* Card 1 */}
                                <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-xl overflow-hidden flex flex-col shadow-sm">
                                    <div className="px-4 py-3 bg-gray-50 dark:bg-[#21262D] border-b border-gray-200 dark:border-[#30363D] flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="critical">Critical</Badge>
                                            <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-200">ProfilePage.tsx</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">L142-148</span>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Update the frontend consumer to use the new API property. The legacy <code className="bg-gray-100 dark:bg-[#0D1117] text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded text-xs font-mono">email</code> field is deprecated in the GraphQL schema.
                                        </p>
                                        
                                        <div className="bg-gray-50 dark:bg-[#0D1117] rounded-lg border border-gray-200 dark:border-[#30363D] overflow-hidden text-sm font-mono leading-6">
                                            <div className="flex text-gray-500 dark:text-gray-400 px-4 py-1">
                                                <span className="w-8 text-right pr-4 select-none opacity-50">141</span>
                                                <span>const UserProfile = ({'{'} user {'}'}) =&gt; {'{'}</span>
                                            </div>
                                            <div className="flex bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-1 border-l-2 border-red-500">
                                                <span className="w-8 text-right pr-4 select-none opacity-50">142</span>
                                                <span>- return &lt;div&gt;{'{'}user.email{'}'}&lt;/div&gt;;</span>
                                            </div>
                                            <div className="flex bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-1 border-l-2 border-green-500">
                                                <span className="w-8 text-right pr-4 select-none opacity-50">142</span>
                                                <span>+ return &lt;div&gt;{'{'}user.primaryEmail{'}'}&lt;/div&gt;;</span>
                                            </div>
                                            <div className="flex text-gray-500 dark:text-gray-400 px-4 py-1 pb-2">
                                                <span className="w-8 text-right pr-4 select-none opacity-50">143</span>
                                                <span>{'}'};</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 py-3 bg-gray-50 dark:bg-[#0D1117] border-t border-gray-200 dark:border-[#30363D] flex justify-end gap-3">
                                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                                            <Zap size={14} className="fill-current" /> Apply Fix
                                        </button>
                                    </div>
                                </div>

                                {/* Alternative Option */}
                                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-8 py-1 rotate-45 translate-x-8 translate-y-3 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                        Expert Choice
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800/30">
                                            <CheckCircle size={24} className="fill-current text-blue-100 dark:text-blue-900/40" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">SAFER MIGRATION OPTION</h3>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                Instead of an immediate breaking change, use a <span className="font-mono text-orange-600 dark:text-orange-400">serialization alias</span>. This allows both <code className="text-xs bg-white dark:bg-[#0D1117] px-1 py-0.5 rounded border border-gray-200 dark:border-[#30363D]">email</code> and <code className="text-xs bg-white dark:bg-[#0D1117] px-1 py-0.5 rounded border border-gray-200 dark:border-[#30363D]">primaryEmail</code> to function during the 30-day transition period.
                                            </p>
                                            <div className="flex items-center gap-3 pt-2">
                                                <button className="text-sm font-bold text-blue-600 dark:text-blue-400 underline decoration-blue-300 hover:decoration-blue-600 transition-colors">
                                                    View compatibility script
                                                </button>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Reduces deployment risk by 68%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="xl:col-span-4 flex flex-col gap-3">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-transform active:scale-95">
                                    <Zap className="fill-current" size={18} />
                                    Execute Complete Plan
                                </button>
                                <button className="w-full border border-gray-200 dark:border-[#30363D] bg-white dark:bg-[#161B22] py-3 rounded-lg font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#21262D] transition-colors shadow-sm">
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
