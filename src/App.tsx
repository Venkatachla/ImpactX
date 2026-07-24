/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import DashboardView from './views/DashboardView';
import ImportView from './views/ImportView';
import ChangeSelectionView from './views/ChangeSelectionView';
import ProgressView from './views/ProgressView';
import ResultView from './views/ResultView';

export default function App() {
    const [currentView, setCurrentView] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check system preference on load
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const renderView = () => {
        switch(currentView) {
            case 'dashboard': return <DashboardView onNavigate={setCurrentView} />;
            case 'import': return <ImportView onNavigate={setCurrentView} />;
            case 'select-change': return <ChangeSelectionView onNavigate={setCurrentView} />;
            case 'progress': return <ProgressView onNavigate={setCurrentView} />;
            case 'results': return <ResultView onNavigate={setCurrentView} />;
            default: return <DashboardView onNavigate={setCurrentView} />;
        }
    }

    return (
        <Layout
            currentView={currentView}
            onNavigate={setCurrentView}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
        >
            {renderView()}
        </Layout>
    );
}

