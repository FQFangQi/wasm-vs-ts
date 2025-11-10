// 数据结构操作测试 - TypeScript 版本

/**数组 Map 操作*/
export function arrayMap(arr: number[], value: number): number {
  return arr.reduce((sum, item) => sum + item * value, 0);
}

/**数组 Filter 操作*/
export function arrayFilter(arr: number[], threshold: number): number {
  return arr.filter(item => item > threshold).length;
}

/**数组 Reduce 操作*/
export function arrayReduce(arr: number[]): number {
  return arr.reduce((sum, item) => sum + item, 0);
}

/**查找最大值*/
export function findMax(arr: number[]): number {
  return Math.max(...arr);
}

/**查找最小值*/
export function findMin(arr: number[]): number {
  return Math.min(...arr);
}

/**计算一遍数组并返回统计信息*/
export function calculateStatistics(arr: number[]): number {
  const sum = arr.reduce((a, b) => a + b, 0);
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  
  // 返回 min + max + sum 的组合作为结果
  return min + max + sum;
}

