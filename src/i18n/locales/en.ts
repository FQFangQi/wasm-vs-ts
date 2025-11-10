export default {
  translation: {
    // Title and subtitle
    title: 'WebAssembly vs TypeScript Performance Benchmark',
    subtitle: 'Compile TypeScript to WebAssembly via AssemblyScript and compare performance',
    footer: 'Providing decision-making basis for WebAssembly technology stack',
    
    // Control buttons
    runButton: 'Run Benchmark',
    running: 'Running...',
    configButton: 'Configuration',
    hideConfig: 'Hide Configuration',
    resetButton: 'Reset to Defaults',
    
    // Status messages
    ready: 'Ready',
    loading: 'Loading WASM module...',
    testing: 'Testing',
    complete: 'Test completed!',
    notLoaded: 'WASM module not loaded',
    notBuilt: 'WASM module not built, please run npm run asbuild',
    testFailed: 'Test failed',
    
    // Configuration panel
    configTitle: 'Test Parameters Configuration',
    arraySize: 'Array Size',
    filterThreshold: 'Filter Threshold',
    matrixMedium: 'Matrix Size - Medium',
    matrixLarge: 'Matrix Size - Large',
    fibSmall: 'Fibonacci - Small',
    fibLarge: 'Fibonacci - Large',
    primeLimit: 'Prime Limit',
    max: 'Max',
    configWarning: 'Setting too large parameters may cause browser slowdown or unresponsiveness',
    
    // Results summary
    summaryTitle: 'Test Results Summary',
    totalTests: 'Total Tests',
    wasmFaster: 'WASM Faster',
    avgSpeedup: 'Avg Speedup',
    
    // Categories
    numeric: 'Numeric Computing',
    dataStructure: 'Data Structure',
    stringProcessing: 'String Processing',
    
    // Test names
    fibonacciIterative: 'Fibonacci Iterative',
    matrixMultiply: 'Matrix Multiply',
    sieveOfEratosthenes: 'Sieve of Eratosthenes',
    arrayStatistics: 'Array Statistics',
    arrayMap: 'Array Map',
    arrayFilter: 'Array Filter',
    arrayReduce: 'Array Reduce',
    elements: 'elements',
    threshold: 'threshold',
    
    // Charts
    chartOverall: 'Overall Performance Comparison',
    chartDescription: 'Execution time comparison between WebAssembly and TypeScript for all test scenarios (lower is better)',
    chartZoomHint: 'Tip: Hold Ctrl + Scroll to zoom Y-axis, Ctrl + Drag to pan',
    chartNumeric: 'Numeric Computing',
    chartNumericDesc: 'Testing performance in intensive mathematical computation scenarios',
    chartDataStructure: 'Data Structure',
    chartDataStructureDesc: 'Testing performance in array operations and data processing scenarios',
    chartStringProcessing: 'String Processing',
    chartStringProcessingDesc: 'Testing performance in string operation scenarios',
    chartTitleSuffix: 'Performance Analysis',
    chartSpeedup: 'Performance Speedup Analysis',
    chartSpeedupDesc: 'Shows the performance multiplier of TypeScript relative to WebAssembly (>1 means WASM faster, <1 means TS faster)',
    performanceComparison: 'Performance Comparison - Execution Time (ms)',
    categoryPerformanceComparison: '{{category}} - Performance Comparison - Execution Time (ms)',
    executionTime: 'Performance Comparison - Execution Time (ms)',
    executionTimeMs: 'Execution Time (milliseconds)',
    testScenarios: 'Test Scenarios',
    testItems: 'Test Items',
    speedupRatio: 'Speedup Ratio',
    speedupBaseline: 'Performance Speedup Comparison (Baseline = 1.0)',
    speedupLabel: 'Speedup (TS time ÷ WASM time)',
    faster: 'faster',
    improvement: 'improvement',
    speedup: 'speedup',
    
    // Table
    tableTitle: 'Detailed Performance Metrics',
    testName: 'Test Name',
    category: 'Category',
    average: 'Avg',
    min: 'Min',
    fasterThan: 'Faster',
    
    // Tooltip
    wasmFasterTooltip: 'WASM faster',
    tsFasterTooltip: 'TS faster',
    
    // Disclaimer
    disclaimer: 'Disclaimer',
    disclaimerContent: 'These benchmark results are for reference only. Actual performance is affected by various factors including but not limited to: browser version, operating system, hardware configuration, CPU load, memory state, JavaScript engine optimization, etc. Test results may vary significantly across different environments. It is recommended to conduct targeted performance testing in actual projects. The test uses the Trimmed Mean method (removing the highest and lowest 20% of data) to improve result stability.',
    testingTips: 'Testing Tips',
    testingTipsContent: 'For more accurate test results: close other tabs and applications, ensure your computer is plugged in, do not switch tabs during testing, run multiple times and take the average.',
    
    // History
    history: 'History',
    noHistory: 'No history records yet',
    load: 'Load',
    loadResults: 'Load this result',
    delete: 'Delete',
    clearAll: 'Clear All',
    confirmDelete: 'Are you sure you want to delete this record?',
    confirmClearAll: 'Are you sure you want to clear all history? This action cannot be undone!',
    exportJSON: 'Export JSON',
    exportCSV: 'Export CSV',
    environment: 'Environment',
  }
};

