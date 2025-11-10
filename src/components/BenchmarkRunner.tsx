import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  WarningOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { loadWasm } from '../utils/wasm-loader';
import { benchmark, compareResults } from '../utils/benchmark';
import { saveToHistory } from '../utils/storage';
import * as TSNumeric from '../benchmarks/numeric';
import * as TSDataStructure from '../benchmarks/datastructure';
import type { Result } from '../types';

export interface BenchmarkSuite {
  name: string;
  category: string;
  testFn: () => void;
}

interface Props {
  onResultsChange: (results: Result[]) => void;
  onTestComplete?: () => void;
}

// 默认参数
const DEFAULT_ARRAY_SIZE = 100_000;
const DEFAULT_FILTER_THRESHOLD = 5_000;
const DEFAULT_MATRIX_MEDIUM = 150;
const DEFAULT_MATRIX_LARGE = 250;
const DEFAULT_FIB_SMALL = 1_000_000;
const DEFAULT_FIB_LARGE = 5_000_000;
const DEFAULT_PRIME_LIMIT = 100_000;

// 最大限制（防止死机）
const MAX_ARRAY_SIZE = 1_000_000;
const MAX_MATRIX_SIZE = 500;
const MAX_FIB_N = 10_000_000;
const MAX_PRIME_LIMIT = 1_000_000;

const formatNumber = (value: number) => value.toLocaleString('en-US');

function createInt32Array(length: number): Int32Array {
  const data = new Int32Array(length);
  for (let i = 0; i < length; i += 1) {
    data[i] = (i * 31) % 10_007;
  }
  return data;
}

function createNumberArrayFrom(values: Int32Array): number[] {
  const data = new Array<number>(values.length);
  for (let i = 0; i < values.length; i += 1) {
    data[i] = values[i];
  }
  return data;
}

export default function BenchmarkRunner({ onResultsChange, onTestComplete }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [status, setStatus] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  
  // 用户可配置参数
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY_SIZE);
  const [filterThreshold, setFilterThreshold] = useState(DEFAULT_FILTER_THRESHOLD);
  const [matrixMedium, setMatrixMedium] = useState(DEFAULT_MATRIX_MEDIUM);
  const [matrixLarge, setMatrixLarge] = useState(DEFAULT_MATRIX_LARGE);
  const [fibSmall, setFibSmall] = useState(DEFAULT_FIB_SMALL);
  const [fibLarge, setFibLarge] = useState(DEFAULT_FIB_LARGE);
  const [primeLimit, setPrimeLimit] = useState(DEFAULT_PRIME_LIMIT);

  useEffect(() => {
    setStatus(t('ready'));
    loadWasm()
      .then(() => setWasmLoaded(true))
      .catch((err) => {
        console.error('WASM 加载失败:', err);
        setStatus(t('notBuilt'));
      });
  }, [t]);

  const runBenchmarks = async () => {
    if (!wasmLoaded) {
      setStatus(t('notLoaded'));
      return;
    }

    setIsLoading(true);
    setStatus(t('loading'));

    try {
      const wasm = await loadWasm();
      const aggregatedResults: Result[] = [];

      const int32Data = createInt32Array(arraySize);
      const numberData = createNumberArrayFrom(int32Data);

      interface ExtendedBenchmarkSuite extends BenchmarkSuite {
        categoryKey: string;
        testKey: string;
        params?: Record<string, number>;
      }

      const wasmSuites: ExtendedBenchmarkSuite[] = [
        {
          name: `${t('fibonacciIterative')} (n=${formatNumber(fibSmall)})`,
          category: t('numeric'),
          categoryKey: 'numeric',
          testKey: 'fibonacciIterative',
          params: { n: fibSmall },
          testFn: () => wasm.fibonacciIterative(fibSmall),
        },
        {
          name: `${t('fibonacciIterative')} (n=${formatNumber(fibLarge)})`,
          category: t('numeric'),
          categoryKey: 'numeric',
          testKey: 'fibonacciIterative',
          params: { n: fibLarge },
          testFn: () => wasm.fibonacciIterative(fibLarge),
        },
        {
          name: `${t('matrixMultiply')} (${matrixMedium} × ${matrixMedium})`,
          category: t('numeric'),
          categoryKey: 'numeric',
          testKey: 'matrixMultiply',
          params: { size: matrixMedium },
          testFn: () => wasm.matrixMultiply(matrixMedium),
        },
        {
          name: `${t('matrixMultiply')} (${matrixLarge} × ${matrixLarge})`,
          category: t('numeric'),
          categoryKey: 'numeric',
          testKey: 'matrixMultiply',
          params: { size: matrixLarge },
          testFn: () => wasm.matrixMultiply(matrixLarge),
        },
        {
          name: `${t('sieveOfEratosthenes')} (n=${formatNumber(primeLimit)})`,
          category: t('numeric'),
          categoryKey: 'numeric',
          testKey: 'sieveOfEratosthenes',
          params: { n: primeLimit },
          testFn: () => wasm.sieveOfEratosthenes(primeLimit),
        },
        {
          name: `${t('arrayStatistics')} (${formatNumber(arraySize)} ${t('elements')})`,
          category: t('dataStructure'),
          categoryKey: 'dataStructure',
          testKey: 'arrayStatistics',
          params: { arraySize },
          testFn: () => wasm.calculateStatistics(int32Data),
        },
        {
          name: `${t('arrayMap')} (${formatNumber(arraySize)} ${t('elements')})`,
          category: t('dataStructure'),
          categoryKey: 'dataStructure',
          testKey: 'arrayMap',
          params: { arraySize },
          testFn: () => wasm.arrayMap(int32Data, 5),
        },
        {
          name: `${t('arrayFilter')} (${formatNumber(arraySize)} ${t('elements')}, ${t('threshold')} ${formatNumber(filterThreshold)})`,
          category: t('dataStructure'),
          categoryKey: 'dataStructure',
          testKey: 'arrayFilter',
          params: { arraySize, threshold: filterThreshold },
          testFn: () => wasm.arrayFilter(int32Data, filterThreshold),
        },
        {
          name: `${t('arrayReduce')} (${formatNumber(arraySize)} ${t('elements')})`,
          category: t('dataStructure'),
          categoryKey: 'dataStructure',
          testKey: 'arrayReduce',
          params: { arraySize },
          testFn: () => wasm.arrayReduce(int32Data),
        },
      ];

      const tsSuites: ExtendedBenchmarkSuite[] = [
        {
          name: `${t('fibonacciIterative')} (n=${formatNumber(fibSmall)})`,
          category: t('numeric'),
          categoryKey: 'numeric',
          testKey: 'fibonacciIterative',
          params: { n: fibSmall },
          testFn: () => TSNumeric.fibonacciIterative(fibSmall),
        },
        {
          name: `${t('fibonacciIterative')} (n=${formatNumber(fibLarge)})`,
          category: t('numeric'),
          categoryKey: 'numeric',
          testKey: 'fibonacciIterative',
          params: { n: fibLarge },
          testFn: () => TSNumeric.fibonacciIterative(fibLarge),
        },
        {
          name: `${t('matrixMultiply')} (${matrixMedium} × ${matrixMedium})`,
          category: t('numeric'),
          categoryKey: 'numeric',
          testKey: 'matrixMultiply',
          params: { size: matrixMedium },
          testFn: () => TSNumeric.matrixMultiply(matrixMedium),
        },
        {
          name: `${t('matrixMultiply')} (${matrixLarge} × ${matrixLarge})`,
          category: t('numeric'),
          categoryKey: 'numeric',
          testKey: 'matrixMultiply',
          params: { size: matrixLarge },
          testFn: () => TSNumeric.matrixMultiply(matrixLarge),
        },
        {
          name: `${t('sieveOfEratosthenes')} (n=${formatNumber(primeLimit)})`,
          category: t('numeric'),
          categoryKey: 'numeric',
          testKey: 'sieveOfEratosthenes',
          params: { n: primeLimit },
          testFn: () => TSNumeric.sieveOfEratosthenes(primeLimit),
        },
        {
          name: `${t('arrayStatistics')} (${formatNumber(arraySize)} ${t('elements')})`,
          category: t('dataStructure'),
          categoryKey: 'dataStructure',
          testKey: 'arrayStatistics',
          params: { arraySize },
          testFn: () => TSDataStructure.calculateStatistics(numberData),
        },
        {
          name: `${t('arrayMap')} (${formatNumber(arraySize)} ${t('elements')})`,
          category: t('dataStructure'),
          categoryKey: 'dataStructure',
          testKey: 'arrayMap',
          params: { arraySize },
          testFn: () => TSDataStructure.arrayMap(numberData, 5),
        },
        {
          name: `${t('arrayFilter')} (${formatNumber(arraySize)} ${t('elements')}, ${t('threshold')} ${formatNumber(filterThreshold)})`,
          category: t('dataStructure'),
          categoryKey: 'dataStructure',
          testKey: 'arrayFilter',
          params: { arraySize, threshold: filterThreshold },
          testFn: () => TSDataStructure.arrayFilter(numberData, filterThreshold),
        },
        {
          name: `${t('arrayReduce')} (${formatNumber(arraySize)} ${t('elements')})`,
          category: t('dataStructure'),
          categoryKey: 'dataStructure',
          testKey: 'arrayReduce',
          params: { arraySize },
          testFn: () => TSDataStructure.arrayReduce(numberData),
        },
      ];

      for (let i = 0; i < wasmSuites.length; i += 1) {
        setStatus(`${t('testing')}: ${wasmSuites[i].name} (${i + 1}/${wasmSuites.length})`);

        const wasmResult = await benchmark(wasmSuites[i].testFn);
        const tsResult = await benchmark(tsSuites[i].testFn);
        const comparison = compareResults(wasmResult, tsResult);

        aggregatedResults.push({
          name: wasmSuites[i].name,
          category: wasmSuites[i].category,
          categoryKey: wasmSuites[i].categoryKey,
          testKey: wasmSuites[i].testKey,
          params: wasmSuites[i].params,
          wasm: wasmResult,
          ts: tsResult,
          comparison,
        });

        setResults([...aggregatedResults]);
        onResultsChange([...aggregatedResults]);

        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 25);
        });
      }

      setStatus(t('complete'));
      
      // 保存到历史记录
      saveToHistory(aggregatedResults);
      
      // 通知父组件测试完成，触发历史记录刷新
      if (onTestComplete) {
        onTestComplete();
      }
    } catch (error) {
      console.error('基准测试失败:', error);
      setStatus(`${t('testFailed')}: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    setArraySize(DEFAULT_ARRAY_SIZE);
    setFilterThreshold(DEFAULT_FILTER_THRESHOLD);
    setMatrixMedium(DEFAULT_MATRIX_MEDIUM);
    setMatrixLarge(DEFAULT_MATRIX_LARGE);
    setFibSmall(DEFAULT_FIB_SMALL);
    setFibLarge(DEFAULT_FIB_LARGE);
    setPrimeLimit(DEFAULT_PRIME_LIMIT);
  };

  const handleNumberInput = (
    value: string,
    setter: (val: number) => void,
    max: number,
    defaultVal: number
  ) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) {
      setter(defaultVal);
    } else if (num > max) {
      setter(max);
    } else {
      setter(num);
    }
  };

  return (
    <div className={`benchmark-runner ${isLoading ? 'running' : ''}`}>
      <div className="controls">
        <button
          onClick={runBenchmarks}
          disabled={isLoading || !wasmLoaded}
          className="run-button"
        >
          {isLoading ? t('running') : t('runButton')}
        </button>
        <button
          onClick={() => setShowConfig(!showConfig)}
          disabled={isLoading}
          className="config-button"
        >
          {showConfig ? t('hideConfig') : t('configButton')}
        </button>
        <div className="status">{status}</div>
      </div>

      {/* 免责声明 */}
      <div className="disclaimer-section">
        <div className="disclaimer-box">
          <h4><WarningOutlined /> {t('disclaimer')}</h4>
          <p>{t('disclaimerContent')}</p>
        </div>
        <div className="tips-box">
          <h4><BulbOutlined /> {t('testingTips')}</h4>
          <p>{t('testingTipsContent')}</p>
        </div>
      </div>

      {showConfig && (
        <div className="config-panel">
          <div className="config-header">
            <h3>{t('configTitle')}</h3>
            <button onClick={resetToDefaults} className="reset-button" disabled={isLoading}>
              {t('resetButton')}
            </button>
          </div>

          <div className="config-grid">
            <div className="config-item">
              <label>{t('arraySize')} ({t('max')} {formatNumber(MAX_ARRAY_SIZE)})</label>
              <input
                type="number"
                value={arraySize}
                onChange={(e) => handleNumberInput(e.target.value, setArraySize, MAX_ARRAY_SIZE, DEFAULT_ARRAY_SIZE)}
                disabled={isLoading}
                min="1"
                max={MAX_ARRAY_SIZE}
              />
            </div>

            <div className="config-item">
              <label>{t('filterThreshold')} ({t('max')} {formatNumber(MAX_ARRAY_SIZE)})</label>
              <input
                type="number"
                value={filterThreshold}
                onChange={(e) => handleNumberInput(e.target.value, setFilterThreshold, MAX_ARRAY_SIZE, DEFAULT_FILTER_THRESHOLD)}
                disabled={isLoading}
                min="1"
                max={MAX_ARRAY_SIZE}
              />
            </div>

            <div className="config-item">
              <label>{t('matrixMedium')} ({t('max')} {MAX_MATRIX_SIZE})</label>
              <input
                type="number"
                value={matrixMedium}
                onChange={(e) => handleNumberInput(e.target.value, setMatrixMedium, MAX_MATRIX_SIZE, DEFAULT_MATRIX_MEDIUM)}
                disabled={isLoading}
                min="1"
                max={MAX_MATRIX_SIZE}
              />
            </div>

            <div className="config-item">
              <label>{t('matrixLarge')} ({t('max')} {MAX_MATRIX_SIZE})</label>
              <input
                type="number"
                value={matrixLarge}
                onChange={(e) => handleNumberInput(e.target.value, setMatrixLarge, MAX_MATRIX_SIZE, DEFAULT_MATRIX_LARGE)}
                disabled={isLoading}
                min="1"
                max={MAX_MATRIX_SIZE}
              />
            </div>

            <div className="config-item">
              <label>{t('fibSmall')} ({t('max')} {formatNumber(MAX_FIB_N)})</label>
              <input
                type="number"
                value={fibSmall}
                onChange={(e) => handleNumberInput(e.target.value, setFibSmall, MAX_FIB_N, DEFAULT_FIB_SMALL)}
                disabled={isLoading}
                min="1"
                max={MAX_FIB_N}
              />
            </div>

            <div className="config-item">
              <label>{t('fibLarge')} ({t('max')} {formatNumber(MAX_FIB_N)})</label>
              <input
                type="number"
                value={fibLarge}
                onChange={(e) => handleNumberInput(e.target.value, setFibLarge, MAX_FIB_N, DEFAULT_FIB_LARGE)}
                disabled={isLoading}
                min="1"
                max={MAX_FIB_N}
              />
            </div>

            <div className="config-item">
              <label>{t('primeLimit')} ({t('max')} {formatNumber(MAX_PRIME_LIMIT)})</label>
              <input
                type="number"
                value={primeLimit}
                onChange={(e) => handleNumberInput(e.target.value, setPrimeLimit, MAX_PRIME_LIMIT, DEFAULT_PRIME_LIMIT)}
                disabled={isLoading}
                min="1"
                max={MAX_PRIME_LIMIT}
              />
            </div>
          </div>

          <div className="config-warning">
            <WarningOutlined /> {t('configWarning')}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="summary">
          <h3>{t('summaryTitle')}</h3>
          <div className="summary-stats">
            <div>{t('totalTests')}: {results.length}</div>
            <div>{t('wasmFaster')}: {results.filter((r) => r.comparison.wasmFaster).length}</div>
            <div>
              {t('avgSpeedup')}: {
                (results.reduce((sum, r) => sum + r.comparison.speedup, 0) / results.length).toFixed(2)
              }
              x
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
