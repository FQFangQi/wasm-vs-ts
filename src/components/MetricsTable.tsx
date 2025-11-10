import { useTranslation } from 'react-i18next';
import type { Result } from '../types';

interface Props {
  results: Result[];
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

export default function MetricsTable({ results }: Props) {
  const { t } = useTranslation();
  
  if (results.length === 0) return null;

  return (
    <div className="metrics-table-container">
      <div className="table-header">
        <h3>{t('tableTitle')}</h3>
      </div>
      <div className="table-wrapper">
        <table className="metrics-table">
          <thead>
            <tr>
              <th rowSpan={2}>{t('testName')}</th>
              <th rowSpan={2}>{t('category')}</th>
              <th colSpan={3}>WebAssembly (ms)</th>
              <th colSpan={3}>TypeScript (ms)</th>
              <th rowSpan={2}>{t('speedup')}</th>
              <th rowSpan={2}>{t('improvement')} (%)</th>
              <th rowSpan={2}>{t('fasterThan')}</th>
            </tr>
            <tr>
              <th className="wasm-header">{t('average')}</th>
              <th className="wasm-header">{t('min')}</th>
              <th className="wasm-header">{t('max')}</th>
              <th className="ts-header">{t('average')}</th>
              <th className="ts-header">{t('min')}</th>
              <th className="ts-header">{t('max')}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => {
              /**向后兼容：如果没有testKey和categoryKey，使用原始的name和category*/
              const testName = result.testKey 
                ? getLocalizedTestName(result.testKey, result.params, t)
                : result.name;
              const category = result.categoryKey 
                ? t(result.categoryKey)
                : result.category;
              
              return (
                <tr key={index} className={result.comparison.wasmFaster ? 'wasm-faster' : 'ts-faster'}>
                  <td className="name-cell">{testName}</td>
                  <td>{category}</td>
                  <td className="wasm-cell">{result.wasm.average.toFixed(3)}</td>
                  <td className="wasm-cell">{result.wasm.min.toFixed(3)}</td>
                  <td className="wasm-cell">{result.wasm.max.toFixed(3)}</td>
                  <td className="ts-cell">{result.ts.average.toFixed(3)}</td>
                  <td className="ts-cell">{result.ts.min.toFixed(3)}</td>
                  <td className="ts-cell">{result.ts.max.toFixed(3)}</td>
                  <td className={result.comparison.wasmFaster ? 'speedup-positive' : 'speedup-negative'}>
                    {result.comparison.speedup.toFixed(2)}x
                  </td>
                  <td className={result.comparison.improvementPercent > 0 ? 'improvement-positive' : 'improvement-negative'}>
                    {result.comparison.improvementPercent.toFixed(2)}%
                  </td>
                  <td>{result.comparison.wasmFaster ? 'WASM' : 'TS'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
