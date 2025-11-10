export default {
  translation: {
    // 标题和副标题
    title: 'WebAssembly vs TypeScript 性能基准测试',
    subtitle: '通过 AssemblyScript 将 TypeScript 代码编译为 WebAssembly，对比性能差异',
    footer: '为开发者提供 WebAssembly 技术栈的决策依据',
    
    // 控制按钮
    runButton: '运行基准测试',
    running: '运行中...',
    configButton: '参数配置',
    hideConfig: '隐藏配置',
    resetButton: '恢复默认',
    
    // 状态信息
    ready: '准备就绪',
    loading: '正在加载 WASM 模块...',
    testing: '正在测试',
    complete: '测试完成！',
    notLoaded: 'WASM 模块未加载',
    notBuilt: 'WASM 模块未构建，请运行 npm run asbuild',
    testFailed: '测试失败',
    
    // 配置面板
    configTitle: '测试参数配置',
    arraySize: '数组大小',
    filterThreshold: '过滤阈值',
    matrixMedium: '矩阵大小 - 中等',
    matrixLarge: '矩阵大小 - 大型',
    fibSmall: '斐波那契 - 小',
    fibLarge: '斐波那契 - 大',
    primeLimit: '质数筛选上限',
    max: '最大',
    configWarning: '设置过大的参数可能导致浏览器响应缓慢或无响应',
    
    // 结果摘要
    summaryTitle: '测试结果摘要',
    totalTests: '总测试',
    wasmFaster: 'WASM 更快',
    avgSpeedup: '平均加速比',
    
    // 类别
    numeric: '数值计算',
    dataStructure: '数据结构',
    stringProcessing: '字符串处理',
    
    // 测试名称
    fibonacciIterative: '斐波那契迭代',
    matrixMultiply: '矩阵乘法',
    sieveOfEratosthenes: '埃拉托斯特尼筛',
    arrayStatistics: '数组统计',
    arrayMap: '数组 Map',
    arrayFilter: '数组 Filter',
    arrayReduce: '数组 Reduce',
    elements: '元素',
    threshold: '阈值',
    
    // 图表
    chartOverall: '总体性能对比',
    chartDescription: '所有测试场景的 WebAssembly 和 TypeScript 执行时间对比（值越低性能越好）',
    chartZoomHint: '提示：按住 Ctrl + 滚轮可缩放 Y 轴，Ctrl + 拖动可平移',
    chartNumeric: '数值计算',
    chartNumericDesc: '测试密集型数学计算场景下的性能表现',
    chartDataStructure: '数据结构',
    chartDataStructureDesc: '测试数组操作和数据处理场景下的性能表现',
    chartStringProcessing: '字符串处理',
    chartStringProcessingDesc: '测试字符串操作场景下的性能表现',
    chartTitleSuffix: '性能分析',
    chartSpeedup: '性能加速比分析',
    chartSpeedupDesc: '显示 TypeScript 相对于 WebAssembly 的性能倍数（大于1表示WASM更快，小于1表示TS更快）',
    performanceComparison: '性能对比 - 执行时间 (ms)',
    categoryPerformanceComparison: '{{category}} - 平均执行时间对比',
    executionTime: '平均执行时间对比',
    executionTimeMs: '执行时间 (毫秒)',
    testScenarios: '测试场景',
    testItems: '测试项目',
    speedupRatio: '加速比倍数',
    speedupBaseline: '性能加速比对比（基准线 = 1.0）',
    speedupLabel: '加速比 (TS时间 ÷ WASM时间)',
    faster: '更快',
    improvement: '提升',
    speedup: '加速比',
    
    // 表格
    tableTitle: '详细性能指标',
    testName: '测试名称',
    category: '类别',
    average: '平均',
    min: '最小',
    fasterThan: '更快',
    
    // Tooltip
    wasmFasterTooltip: 'WASM 快',
    tsFasterTooltip: 'TS 快',
    
    // 免责声明
    disclaimer: '免责声明',
    disclaimerContent: '本基准测试结果仅供参考。实际性能受多种因素影响，包括但不限于：浏览器版本、操作系统、硬件配置、CPU 负载、内存状态、JavaScript 引擎优化等。不同环境下的测试结果可能存在显著差异。建议在实际项目中进行针对性的性能测试。测试采用 Trimmed Mean 方法（去除最高和最低 20% 数据）以提高结果稳定性。',
    testingTips: '测试建议',
    testingTipsContent: '为获得更准确的测试结果，建议：关闭其他标签页和应用程序、确保电脑接入电源、不要在测试过程中切换标签页、多次运行取平均值。',
    
    // 历史记录
    history: '历史记录',
    noHistory: '暂无历史记录',
    load: '加载',
    loadResults: '加载此结果',
    delete: '删除',
    clearAll: '清空所有',
    confirmDelete: '确定删除此历史记录吗？',
    confirmClearAll: '确定清空所有历史记录吗？此操作不可恢复！',
    exportJSON: '导出 JSON',
    exportCSV: '导出 CSV',
    environment: '测试环境',
  }
};

