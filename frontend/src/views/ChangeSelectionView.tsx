import React, { useState } from 'react';
import { ArrowRight, Code2, Database, Trash2, CheckCircle2 } from 'lucide-react';

export default function ChangeSelectionView({ onNavigate }: { onNavigate: (view: string) => void }) {
    const [selectedChange, setSelectedChange] = useState('dto');

    const changes = [
        {
            id: 'dto',
            icon: Database,
            title: 'Rename UserDTO.email → primaryEmail',
            description: 'Database schema migration and DTO field rename.',
            tag: 'DTO_SCHEMA_CHANGED'
        },
        {
            id: 'signature',
            icon: Code2,
            title: 'Change getUser(Long) → getUser(UUID)',
            description: 'Method signature update in core user service.',
            tag: 'METHOD_SIGNATURE_CHANGED'
        },
        {
            id: 'delete',
            icon: Trash2,
            title: 'Delete calculateDiscount()',
            description: 'Removing deprecated pricing logic.',
            tag: 'METHOD_DELETED'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Select Code Change</h1>
                <p className="text-gray-600 dark:text-gray-400">Choose a detected change from the repository to analyze its impact.</p>
            </div>

            <div className="space-y-4 mb-8">
                {changes.map((change) => {
                    const Icon = change.icon;
                    const isSelected = selectedChange === change.id;
                    return (
                        <div 
                            key={change.id}
                            onClick={() => setSelectedChange(change.id)}
                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                                isSelected 
                                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' 
                                    : 'border-gray-200 dark:border-[#30363D] bg-white dark:bg-[#161B22] hover:border-blue-300 dark:hover:border-blue-700'
                            }`}
                        >
                            <div className={`mt-1 shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                {isSelected ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                    <h3 className={`font-bold text-lg ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                                        {change.title}
                                    </h3>
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-[#0D1117] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#30363D]">
                                        {change.tag}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{change.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-[#30363D]">
                <button 
                    onClick={() => onNavigate('progress')}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    Analyze Impact
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
