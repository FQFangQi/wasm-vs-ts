import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import type { Result } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

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

/**生成简短的测试名称（用于图表标签）*/
function getShortTestName(testKey: string, params: Record<string, number> | undefined, t: (key: string) => string): string {
  if (!params) return t(testKey);
  
  if (testKey === 'fibonacciIterative' && params.n) {
    return `n=${formatNumber(params.n)}`;
  }
  
  if (testKey === 'matrixMultiply' && params.size) {
    return `${params.size}×${params.size}`;
  }
  
  if (testKey === 'sieveOfEratosthenes' && params.n) {
    return `n=${formatNumber(params.n)}`;
  }
  
  if (testKey === 'arrayStatistics' && params.arraySize) {
    return `${formatNumber(params.arraySize)} ${t('elements')}`;
  }
  
  if (testKey === 'arrayMap' && params.arraySize) {
    return `${formatNumber(params.arraySize)} ${t('elements')}`;
  }
  
  if (testKey === 'arrayFilter' && params.arraySize && params.threshold !== undefined) {
    return `${formatNumber(params.arraySize)} ${t('elements')}`;
  }
  
  if (testKey === 'arrayReduce' && params.arraySize) {
    return `${formatNumber(params.arraySize)} ${t('elements')}`;
  }
  
  return t(testKey);
}

export default function ResultsChart({ results }: Props) {
  const { t } = useTranslation();
  
  if (results.length === 0) return null;

  /**向后兼容：如果没有testKey，使用原始的name*/
  const labels = results.map(r => 
    r.testKey ? getLocalizedTestName(r.testKey, r.params, t) : r.name
  );
  const wasmTimes = results.map(r => r.wasm.average);
  const tsTimes = results.map(r => r.ts.average);

  const barData = {
    labels,
    datasets: [
      {
        label: 'WebAssembly',
        data: wasmTimes,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'TypeScript',
        data: tsTimes,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 13,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: t('performanceComparison'),
        font: {
          size: 18,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: function(context: TooltipItem<'bar'>[]) {
            return context[0].label;
          },
          label: function(context: TooltipItem<'bar'>) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y ?? 0;
            return `${datasetLabel}: ${value.toFixed(3)} ms`;
          }
        }
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: 'ctrl' as const,
          },
          pinch: {
            enabled: true,
          },
          mode: 'y' as const,
        },
        pan: {
          enabled: true,
          mode: 'y' as const,
          modifierKey: 'ctrl' as const,
        },
        limits: {
          y: {
            min: 'original' as const,
            max: 'original' as const,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t('executionTimeMs'),
          font: {
            size: 13,
          },
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value: number | string) {
            return typeof value === 'number' ? value.toFixed(2) : value;
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        title: {
          display: true,
          text: t('testScenarios'),
          font: {
            size: 13,
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  /**按类别分组的数据
   * 向后兼容：优先使用categoryKey，如果没有则使用category
   */
  const categories = Array.from(new Set(results.map(r => r.categoryKey || r.category)));
  const categoryData = categories.map(categoryKey => {
    const categoryResults = results.filter(r => 
      (r.categoryKey || r.category) === categoryKey
    );
    const shortLabels = categoryResults.map(r => 
      r.testKey ? getShortTestName(r.testKey, r.params, t) : r.name.split('(')[0].trim()
    );
    const fullLabels = categoryResults.map(r => 
      r.testKey ? getLocalizedTestName(r.testKey, r.params, t) : r.name
    );
    
    /**判断categoryKey是否是已知的翻译键*/
    const knownKeys = ['numeric', 'dataStructure', 'stringProcessing'];
    const category = knownKeys.includes(categoryKey) ? t(categoryKey) : categoryKey;
    
    return {
      categoryKey,
      category,
      labels: shortLabels,
      fullLabels,
      wasmData: categoryResults.map(r => r.wasm.average),
      tsData: categoryResults.map(r => r.ts.average),
    };
  });

  // 为分类图表创建自定义选项
  const createCategoryOptions = (categoryKey: string, fullLabels: string[]) => {
    // 根据类别键获取对应的标题翻译键
    let titleKey = 'chartNumeric';
    if (categoryKey === 'dataStructure') {
      titleKey = 'chartDataStructure';
    } else if (categoryKey === 'stringProcessing') {
      titleKey = 'chartStringProcessing';
    }
    
    return {
    ...options,
    plugins: {
      ...options.plugins,
      title: {
        display: true,
        text: `${t(titleKey)} - ${t('executionTime')}`,
        font: {
          size: 16,
        },
        padding: {
          top: 10,
          bottom: 15,
        },
      },
      tooltip: {
        ...options.plugins.tooltip,
        callbacks: {
          title: function(context: TooltipItem<'bar'>[]) {
            // 显示完整的测试名称
            return fullLabels[context[0].dataIndex] || context[0].label;
          },
          label: function(context: TooltipItem<'bar'>) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y ?? 0;
            return `${datasetLabel}: ${value.toFixed(3)} ms`;
          },
          afterLabel: function(context: TooltipItem<'bar'>) {
            const index = context.dataIndex;
            const wasmTime = (context.chart.data.datasets[0].data[index] as number) ?? 0;
            const tsTime = (context.chart.data.datasets[1].data[index] as number) ?? 0;
            const speedup = (tsTime / wasmTime).toFixed(2);
            const faster = wasmTime < tsTime ? t('wasmFasterTooltip') : t('tsFasterTooltip');
            return `${t('speedup')}: ${speedup}x (${faster})`;
          }
        }
      }
    },
    scales: {
      ...options.scales,
      x: {
        ...options.scales.x,
        title: {
          display: true,
          text: t('testItems'),
          font: {
            size: 12,
          },
        },
      },
    },
  };};

  return (
    <div className="charts">
      <div className="chart-container main-chart">
        <h3>{t('chartOverall')}</h3>
        <p className="chart-description">
          {t('chartDescription')}
          <br />
          <span className="zoom-hint">{t('chartZoomHint')}</span>
        </p>
        <Bar data={barData} options={options} />
      </div>

      {categoryData.map((cat) => {
        // 获取标题和描述的翻译键
        const getCategoryTitle = () => {
          if (cat.categoryKey === 'numeric') return t('chartNumeric');
          if (cat.categoryKey === 'dataStructure') return t('chartDataStructure');
          return t('chartStringProcessing');
        };
        
        const getCategoryDesc = () => {
          if (cat.categoryKey === 'numeric') return t('chartNumericDesc');
          if (cat.categoryKey === 'dataStructure') return t('chartDataStructureDesc');
          return t('chartStringProcessingDesc');
        };
        
        return (
        <div key={cat.categoryKey} className="chart-container category-chart">
          <h3>{getCategoryTitle()} {t('chartTitleSuffix')}</h3>
          <p className="chart-description">
            {getCategoryDesc()}
            <br />
            <span className="zoom-hint">{t('chartZoomHint')}</span>
          </p>
          <Bar
            data={{
              labels: cat.labels,
              datasets: [
                {
                  label: 'WebAssembly',
                  data: cat.wasmData,
                  backgroundColor: 'rgba(167, 216, 216, 0.7)',
                  borderColor: 'rgba(167, 216, 216, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'TypeScript',
                  data: cat.tsData,
                  backgroundColor: 'rgba(244, 167, 182, 0.7)',
                  borderColor: 'rgba(244, 167, 182, 1)',
                  borderWidth: 2,
                },
              ],
            }}
            options={createCategoryOptions(cat.categoryKey, cat.fullLabels)}
          />
        </div>
        );
      })}

      <div className="chart-container speedup-chart">
        <h3>{t('chartSpeedup')}</h3>
        <p className="chart-description">
          {t('chartSpeedupDesc')}
          <br />
          <span className="zoom-hint">{t('chartZoomHint')}</span>
        </p>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: t('speedupLabel'),
                data: results.map(r => r.comparison.speedup),
                backgroundColor: results.map(r =>
                  r.comparison.wasmFaster
                    ? 'rgba(76, 175, 80, 0.7)'
                    : 'rgba(244, 67, 54, 0.7)'
                ),
                borderColor: results.map(r =>
                  r.comparison.wasmFaster
                    ? 'rgba(76, 175, 80, 1)'
                    : 'rgba(244, 67, 54, 1)'
                ),
                borderWidth: 2,
              },
            ],
          }}
          options={{
            ...options,
            plugins: {
              ...options.plugins,
              title: {
                display: true,
                text: t('speedupBaseline'),
                font: {
                  size: 16,
                },
                padding: {
                  top: 10,
                  bottom: 15,
                },
              },
              tooltip: {
                ...options.plugins.tooltip,
                callbacks: {
                  label: function(context: TooltipItem<'bar'>) {
                    const value = context.parsed.y ?? 0;
                    const result = results[context.dataIndex];
                    if (value > 1) {
                      return `WASM ${t('faster')} ${value.toFixed(2)}x (${t('improvement')} ${result.comparison.improvementPercent.toFixed(1)}%)`;
                    } else {
                      return `TS ${t('faster')} ${(1/value).toFixed(2)}x (WASM ${Math.abs(result.comparison.improvementPercent).toFixed(1)}%)`;
                    }
                  },
                  afterLabel: function(context: TooltipItem<'bar'>) {
                    const result = results[context.dataIndex];
                    return [
                      `WASM: ${result.wasm.average.toFixed(3)} ms`,
                      `TS: ${result.ts.average.toFixed(3)} ms`
                    ];
                  }
                }
              },
              legend: {
                display: false,
              },
            },
            scales: {
              ...options.scales,
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: t('speedupRatio'),
                  font: {
                    size: 13,
                  },
                },
                ticks: {
                  font: {
                    size: 11,
                  },
                  callback: function(value) {
                    return typeof value === 'number' ? value.toFixed(1) + 'x' : value;
                  }
                },
                grid: {
                  color: function(context) {
                    // 在 y=1 处画一条明显的基准线
                    if (context.tick.value === 1) {
                      return 'rgba(0, 0, 0, 0.3)';
                    }
                    return 'rgba(0, 0, 0, 0.05)';
                  },
                  lineWidth: function(context) {
                    if (context.tick.value === 1) {
                      return 2;
                    }
                    return 1;
                  }
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

