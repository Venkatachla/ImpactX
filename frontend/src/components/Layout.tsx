import React, { useState } from 'react';
import { LayoutDashboard, Activity, Brain, Settings, Book, HelpCircle, Search, Bell, Moon, Sun, Menu, X, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { THEME_CLASSES, CURRENT_USER, NAV_ITEMS, BOTTOM_NAV_ITEMS } from '../lib/constants';

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
    </div>
    <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">ImpactX</h1>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">Change Intelligence</p>
    </div>
  </div>
);

const NAV_ICONS: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  import: Activity,
  progress: Brain,
  'select-change': Settings,
  docs: Book,
  support: HelpCircle,
};

interface LayoutProps {
    children: React.ReactNode;
    currentView: string;
    onNavigate: (view: string) => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export default function Layout({ children, currentView, onNavigate, isDarkMode, toggleTheme }: LayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className={`flex h-screen ${THEME_CLASSES.subtleBg} text-gray-900 dark:text-gray-100 font-sans`}>
            {/* Mobile Header */}
            <header className={`md:hidden fixed top-0 left-0 right-0 h-16 ${THEME_CLASSES.cardBorder} border-t-0 border-x-0 border-b-1 ${THEME_CLASSES.cardBg} flex items-center justify-between px-4 z-50`}>
                <Logo />
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-500 dark:text-gray-400">
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar */}
            <aside className={cn(
                `fixed inset-y-0 left-0 z-40 w-64 ${THEME_CLASSES.cardBorder} border-t-0 border-b-0 border-l-0 border-r-1 ${THEME_CLASSES.cardBg} flex flex-col transition-transform duration-300 md:translate-x-0`,
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className={`h-16 flex items-center px-6 ${THEME_CLASSES.cardBorder} border-t-0 border-x-0 border-b-1 md:border-b-0 md:mb-6 md:mt-6 md:h-auto`}>
                    <Logo />
                </div>
                
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const Icon = NAV_ICONS[item.id] || Activity;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive 
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-l-2 border-blue-600" 
                                        : `text-gray-600 dark:text-gray-400 ${THEME_CLASSES.hoverBg} hover:text-gray-900 dark:hover:text-gray-200`
                                )}
                            >
                                <Icon size={20} className={cn(isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500")} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4">
                    <button 
                        onClick={() => { onNavigate('import'); setMobileMenuOpen(false); }}
                        className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                        <Plus size={18} />
                        New Analysis
                    </button>
                    
                    <div className={`pt-4 ${THEME_CLASSES.cardBorder} border-t-1 border-x-0 border-b-0 space-y-1`}>
                        {BOTTOM_NAV_ITEMS.map((item) => {
                            const Icon = NAV_ICONS[item.id] || HelpCircle;
                            return (
                                <button
                                    key={item.id}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 md:pl-64 pt-16 md:pt-0">
                {/* Top Header */}
                <header className={`hidden md:flex h-16 ${THEME_CLASSES.cardBorder} border-t-0 border-x-0 border-b-1 ${THEME_CLASSES.cardBg}/80 backdrop-blur-md sticky top-0 z-30 justify-between items-center px-8`}>
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search analyses, repositories, or intelligence..." 
                                className={`w-full ${THEME_CLASSES.subtleBg} ${THEME_CLASSES.cardBorder} text-gray-900 dark:text-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-shadow`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <span className={`text-[10px] font-mono ${THEME_CLASSES.cardBorder} px-1.5 py-0.5 rounded text-gray-400 ${THEME_CLASSES.cardBg}`}>⌘K</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                        <button className={`p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ${THEME_CLASSES.hoverBg} rounded-full transition-colors relative`}>
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#161B22]"></span>
                        </button>
                        <button onClick={toggleTheme} className={`p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ${THEME_CLASSES.hoverBg} rounded-full transition-colors`}>
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        
                        <div className={`h-6 w-px ${THEME_CLASSES.cardBorder} border-t-0 border-b-0 border-r-0 border-l-1`}></div>
                        
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="hidden lg:block text-right">
                                <p className="text-sm font-bold leading-none">{CURRENT_USER.username}</p>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase">{CURRENT_USER.role}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30 flex items-center justify-center font-bold text-xs">
                                {CURRENT_USER.initials}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-gray-50/50 dark:bg-[#0D1117]">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
