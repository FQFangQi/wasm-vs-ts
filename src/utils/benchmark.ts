// 基准测试工具函数

export interface BenchmarkResult {
  average: number;      // 平均执行时间 (ms)
  min: number;          // 最小执行时间 (ms)
  max: number;          // 最大执行时间 (ms)
  stdDev: number;       // 标准差
  runs: number;         // 运行次数
  memoryUsed?: number;  // 内存占用 (bytes)
}

export async function benchmark(
  fn: () => void | Promise<void>,
  runs: number = 50,      // 增加到50次以获得更稳定的结果
  warmup: number = 5      // 增加预热次数让JIT充分优化
): Promise<BenchmarkResult> {
  const results: number[] = [];
  
  // 预热运行 - 让JavaScript引擎的JIT编译器充分优化代码
  for (let i = 0; i < warmup; i++) {
    await fn();
  }
  
  // 添加短暂延迟，让系统稳定
  await new Promise(resolve => setTimeout(resolve, 10));
  
  // 正式测试
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    results.push(end - start);
    
    // 每10次测试后稍作休息，避免CPU过热影响结果
    if (i > 0 && i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 5));
    }
  }
  
  // 对结果排序，准备去除异常值
  results.sort((a, b) => a - b);
  
  // 去除最高和最低的20%数据（Trimmed Mean方法），提高稳定性
  const trimCount = Math.floor(results.length * 0.2);
  const trimmedResults = trimCount > 0 
    ? results.slice(trimCount, results.length - trimCount)
    : results;
  
  // 使用修剪后的数据计算统计信息
  const average = trimmedResults.reduce((a, b) => a + b, 0) / trimmedResults.length;
  const min = Math.min(...trimmedResults);
  const max = Math.max(...trimmedResults);
  const variance = trimmedResults.reduce((sum, r) => sum + Math.pow(r - average, 2), 0) / trimmedResults.length;
  const stdDev = Math.sqrt(variance);
  
  // 获取内存使用情况
  let memoryUsed: number | undefined;
  // @ts-expect-error - performance.memory is non-standard and only available in Chrome
  if (performance.memory) {
    // @ts-expect-error - usedJSHeapSize is non-standard
    memoryUsed = performance.memory.usedJSHeapSize;
  }
  
  return {
    average,
    min,
    max,
    stdDev,
    runs: trimmedResults.length,  // 返回实际用于计算的样本数
    memoryUsed
  };
}

// 比较两个基准测试结果
export function compareResults(wasm: BenchmarkResult, ts: BenchmarkResult) {
  const speedup = ts.average / wasm.average;
  const improvementPercent = ((ts.average - wasm.average) / ts.average) * 100;
  
  return {
    speedup,
    improvementPercent,
    wasmFaster: wasm.average < ts.average,
    details: {
      wasm,
      ts
    }
  };
}

