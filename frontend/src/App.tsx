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
    const [repoPath, setRepoPath] = useState('');
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    useEffect(() => {
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

    const handleImportRepo = (path: string) => {
        setRepoPath(path);
        setCurrentView('select-change');
    };

    const handleSelectChange = (diffMode: string) => {
        setCurrentView('progress');
        // Trigger actual analysis call to our FastAPI backend
        fetch('http://localhost:8000/api/impact/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repoPath: repoPath || 'demo-repo', diffMode })
        })
        .then(res => {
            if (!res.ok) throw new Error('Analysis failed');
            return res.json();
        })
        .then(data => {
            setAnalysisResult(data);
            setCurrentView('results');
        })
        .catch(err => {
            console.error(err);
            // Fallback so it doesn't get stuck if server is not running
            setTimeout(() => setCurrentView('results'), 2000);
        });
    };

    const renderView = () => {
        switch(currentView) {
            case 'dashboard': return <DashboardView onNavigate={setCurrentView} />;
            case 'import': return <ImportView onNavigate={handleImportRepo} />;
            case 'select-change': return <ChangeSelectionView onNavigate={handleSelectChange} />;
            case 'progress': return <ProgressView onNavigate={setCurrentView} />;
            case 'results': return <ResultView onNavigate={setCurrentView} analysisData={analysisResult} />;
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
