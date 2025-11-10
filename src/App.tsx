import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';
import BenchmarkRunner from './components/BenchmarkRunner';
import ResultsChart from './components/ResultsChart';
import MetricsTable from './components/MetricsTable';
import History from './components/History';
import type { Result } from './types';
import './App.css';

function App() {
  const [results, setResults] = useState<Result[]>([]);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  // 当测试完成时，触发历史记录刷新
  const handleTestComplete = () => {
    setHistoryRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{t('title')}</h1>
            <p className="subtitle">{t('subtitle')}</p>
          </div>
          <button className="language-toggle" onClick={toggleLanguage}>
            <GlobalOutlined />
            {i18n.language.startsWith('zh') ? 'English' : '中文'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <BenchmarkRunner 
          onResultsChange={setResults} 
          onTestComplete={handleTestComplete}
        />
        
        {results.length > 0 && (
          <div className="results-section">
            <ResultsChart results={results} />
            <MetricsTable results={results} />
          </div>
        )}

        <History 
          onLoadResults={setResults} 
          refreshTrigger={historyRefreshTrigger}
        />
      </main>

      <footer className="app-footer">
        <p>{t('footer')}</p>
      </footer>
    </div>
  );
}

export default App;
