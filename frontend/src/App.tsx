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
    const [baselineData, setBaselineData] = useState<any>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [loadingBaseline, setLoadingBaseline] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

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
        setLoadingBaseline(true);
        setErrorMsg('');
        setAnalysisResult(null);
        setBaselineData(null);
        setCurrentView('progress');

        // Phase 1 - Baseline Map scan
        fetch('http://localhost:8000/api/repositories/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repoPath: path })
        })
        .then(res => {
            if (!res.ok) throw new Error('Repository parsing failed.');
            return res.json();
        })
        .then(data => {
            setBaselineData(data);
            setLoadingBaseline(false);
            setCurrentView('select-change');
        })
        .catch(err => {
            setLoadingBaseline(false);
            setErrorMsg(err.message);
            setCurrentView('import');
        });
    };

    const handleSelectChange = (diffMode: string) => {
        setCurrentView('progress');
        // Phase 2 - Trigger active impact analysis
        fetch('http://localhost:8000/api/impact/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repoPath: repoPath, diffMode })
        })
        .then(res => {
            if (!res.ok) throw new Error('Blast radius analysis failed.');
            return res.json();
        })
        .then(data => {
            setAnalysisResult(data);
            setCurrentView('results');
        })
        .catch(err => {
            setErrorMsg(err.message);
            setCurrentView('select-change');
        });
    };

    const handlePromoteBaseline = () => {
        // Promote changes to become the new baseline snapshot
        fetch('http://localhost:8000/api/repositories/promote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repoPath: repoPath })
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to promote snapshot.');
            return res.json();
        })
        .then(() => {
            alert('Current state promoted as the new Baseline Snapshot successfully!');
            setCurrentView('select-change');
        })
        .catch(err => {
            alert(err.message);
        });
    };

    const renderView = () => {
        switch(currentView) {
            case 'dashboard': return <DashboardView onNavigate={setCurrentView} />;
            case 'import': return <ImportView onNavigate={handleImportRepo} />;
            case 'select-change': return (
                <ChangeSelectionView 
                    onNavigate={handleSelectChange} 
                    baselineData={baselineData} 
                    errorMsg={errorMsg}
                />
            );
            case 'progress': return <ProgressView onNavigate={setCurrentView} />;
            case 'results': return (
                <ResultView 
                    onNavigate={setCurrentView} 
                    analysisData={analysisResult} 
                    onPromote={handlePromoteBaseline}
                />
            );
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
