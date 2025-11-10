// 本地存储工具类

import type { Result } from '../types';

export interface HistoryRecord {
  id: string;
  timestamp: number;
  results: Result[];
  environment: {
    userAgent: string;
    platform: string;
    language: string;
  };
}

const STORAGE_KEY = 'wasm-benchmark-history';
const MAX_HISTORY_RECORDS = 50; // 最多保存50条记录

export function getHistory(): HistoryRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

export function saveToHistory(results: Result[]): void {
  try {
    const history = getHistory();
    const newRecord: HistoryRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: Date.now(),
      results,
      environment: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      },
    };

    history.unshift(newRecord);

    if (history.length > MAX_HISTORY_RECORDS) {
      history.splice(MAX_HISTORY_RECORDS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

export function deleteHistoryRecord(id: string): void {
  try {
    const history = getHistory();
    const filtered = history.filter(record => record.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete history record:', error);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

export function exportHistory(): string {
  const history = getHistory();
  return JSON.stringify(history, null, 2);
}

export function exportHistoryAsCSV(): string {
  const history = getHistory();
  if (history.length === 0) return '';

  const headers = [
    'Date',
    'Test Name',
    'Category',
    'WASM Avg (ms)',
    'WASM Min (ms)',
    'WASM Max (ms)',
    'TS Avg (ms)',
    'TS Min (ms)',
    'TS Max (ms)',
    'Speedup',
    'Improvement (%)',
    'Faster',
  ];

  const rows = history.flatMap(record => {
    const date = new Date(record.timestamp).toLocaleString();
    return record.results.map(result => [
      date,
      result.name,
      result.category,
      result.wasm.average.toFixed(3),
      result.wasm.min.toFixed(3),
      result.wasm.max.toFixed(3),
      result.ts.average.toFixed(3),
      result.ts.min.toFixed(3),
      result.ts.max.toFixed(3),
      result.comparison.speedup.toFixed(2),
      result.comparison.improvementPercent.toFixed(2),
      result.comparison.wasmFaster ? 'WASM' : 'TS',
    ]);
  });

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

