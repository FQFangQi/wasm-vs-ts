import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HistoryOutlined,
  CalendarOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ClearOutlined,
  FileTextOutlined,
  BarChartOutlined,
  RightOutlined,
  DownOutlined,
  LaptopOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import {
  getHistory,
  deleteHistoryRecord,
  clearHistory,
  exportHistory,
  exportHistoryAsCSV,
  type HistoryRecord,
} from '../utils/storage';
import type { Result } from '../types';

interface Props {
  onLoadResults: (results: Result[]) => void;
  refreshTrigger?: number; // 用于触发刷新的 prop
}

const formatNumber = (value: number) => value.toLocaleString('en-US');

/**根据testKey和params生成翻译后的测试名称*/
function getLocalizedTestName(testKey: string, params: Record<string, number> | undefined, t: (key: string) => string): string {
  if (!params) return t(testKey);
  
  const testName = t(testKey);
  
  if (testKey === 'fibonacciIterative' && params.n) {
    return `${testName} (n=${formatNumber(params.n)})`;
  }
  
  if (testKey === 'matrixMultiply' && params.size) {
    return `${testName} (${params.size} × ${params.size})`;
  }
  
  if (testKey === 'sieveOfEratosthenes' && params.n) {
    return `${testName} (n=${formatNumber(params.n)})`;
  }
  
  if (testKey === 'arrayStatistics' && params.arraySize) {
    return `${testName} (${formatNumber(params.arraySize)} ${t('elements')})`;
  }
  
  if (testKey === 'arrayMap' && params.arraySize) {
    return `${testName} (${formatNumber(params.arraySize)} ${t('elements')})`;
  }
  
  if (testKey === 'arrayFilter' && params.arraySize && params.threshold !== undefined) {
    return `${testName} (${formatNumber(params.arraySize)} ${t('elements')}, ${t('threshold')} ${formatNumber(params.threshold)})`;
  }
  
  if (testKey === 'arrayReduce' && params.arraySize) {
    return `${testName} (${formatNumber(params.arraySize)} ${t('elements')})`;
  }
  
  return testName;
}

export default function History({ onLoadResults, refreshTrigger }: Props) {
  const { t } = useTranslation();
  const [history, setHistory] = useState<HistoryRecord[]>(getHistory());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 监听 refreshTrigger 变化，自动刷新历史记录
  useEffect(() => {
    setHistory(getHistory());
  }, [refreshTrigger]);

  const refreshHistory = () => {
    setHistory(getHistory());
  };

  const handleDelete = (id: string) => {
    if (confirm(t('confirmDelete'))) {
      deleteHistoryRecord(id);
      refreshHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm(t('confirmClearAll'))) {
      clearHistory();
      refreshHistory();
    }
  };

  const handleExportJSON = () => {
    const data = exportHistory();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmark-history-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const data = exportHistoryAsCSV();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmark-history-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoad = (results: Result[]) => {
    onLoadResults(results);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (history.length === 0) {
    return (
      <div className="history-container">
        <div className="history-header">
          <h3><HistoryOutlined /> {t('history')}</h3>
        </div>
        <div className="history-empty">
          <FileTextOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
          <p>{t('noHistory')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h3><HistoryOutlined /> {t('history')} ({history.length})</h3>
        <div className="history-actions">
          <button onClick={handleExportJSON} className="export-button">
            <FileTextOutlined /> {t('exportJSON')}
          </button>
          <button onClick={handleExportCSV} className="export-button">
            <DownloadOutlined /> {t('exportCSV')}
          </button>
          <button onClick={handleClearAll} className="clear-button">
            <ClearOutlined /> {t('clearAll')}
          </button>
        </div>
      </div>

      <div className="history-list">
        {history.map((record) => {
          const date = new Date(record.timestamp);
          const wasmFasterCount = record.results.filter(r => r.comparison.wasmFaster).length;
          const avgSpeedup = (
            record.results.reduce((sum, r) => sum + r.comparison.speedup, 0) /
            record.results.length
          ).toFixed(2);
          const isExpanded = expandedId === record.id;

          return (
            <div key={record.id} className="history-item">
              <div className="history-item-header" onClick={() => toggleExpand(record.id)}>
                <div className="history-item-info">
                  <div className="history-item-date">
                    <CalendarOutlined /> {date.toLocaleDateString()} {date.toLocaleTimeString()}
                  </div>
                  <div className="history-item-stats">
                    <span className="stat-badge">
                      <BarChartOutlined /> {t('totalTests')}: {record.results.length}
                    </span>
                    <span className="stat-badge wasm-badge">
                      <ThunderboltOutlined /> {t('wasmFaster')}: {wasmFasterCount}
                    </span>
                    <span className="stat-badge">
                      <RocketOutlined /> {t('avgSpeedup')}: {avgSpeedup}x
                    </span>
                  </div>
                </div>
                <div className="history-item-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoad(record.results);
                    }}
                    className="load-button"
                    title={t('loadResults')}
                  >
                    <BarChartOutlined /> {t('load')}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(record.id);
                    }}
                    className="delete-button"
                    title={t('delete')}
                    style={{ paddingRight: 6 }}
                  >
                    <DeleteOutlined />
                  </button>
                  <span className="expand-icon">{isExpanded ? <DownOutlined /> : <RightOutlined />}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="history-item-details">
                  <div className="history-item-env">
                    <strong>{t('environment')}:</strong>
                    <div className="env-info">
                      <div><LaptopOutlined /> {record.environment.platform}</div>
                      <div><GlobalOutlined /> {record.environment.language}</div>
                    </div>
                  </div>
                  <div className="history-item-results">
                    <table className="mini-results-table">
                      <thead>
                        <tr>
                          <th>{t('testName')}</th>
                          <th>{t('category')}</th>
                          <th>WASM (ms)</th>
                          <th>TS (ms)</th>
                          <th>{t('speedup')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {record.results.map((result, idx) => {
                          // 向后兼容：如果没有testKey和categoryKey，使用原始的name和category
                          const testName = result.testKey 
                            ? getLocalizedTestName(result.testKey, result.params, t)
                            : result.name;
                          const category = result.categoryKey 
                            ? t(result.categoryKey)
                            : result.category;
                          
                          return (
                            <tr
                              key={idx}
                              className={result.comparison.wasmFaster ? 'wasm-faster' : 'ts-faster'}
                            >
                              <td>{testName}</td>
                              <td>{category}</td>
                              <td>{result.wasm.average.toFixed(3)}</td>
                              <td>{result.ts.average.toFixed(3)}</td>
                              <td>{result.comparison.speedup.toFixed(2)}x</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

