// 数据结构操作测试 - AssemblyScript 版本

// 数组 Map 操作
export function arrayMap(arr: Int32Array, value: i32): i32 {
  let result: i32 = 0;
  for (let i = 0; i < arr.length; i++) {
    result += arr[i] * value;
  }
  return result;
}

// 数组 Filter 操作
export function arrayFilter(arr: Int32Array, threshold: i32): i32 {
  let count: i32 = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > threshold) {
      count++;
    }
  }
  return count;
}

// 数组 Reduce 操作
export function arrayReduce(arr: Int32Array): i32 {
  let sum: i32 = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

// 查找最大值
export function findMax(arr: Int32Array): i32 {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

// 查找最小值
export function findMin(arr: Int32Array): i32 {
  let min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    }
  }
  return min;
}

// 计算一遍数组并返回统计信息
export function calculateStatistics(arr: Int32Array): i32 {
  let sum: i32 = 0;
  let count: i32 = 0;
  let min: i32 = arr[0];
  let max: i32 = arr[0];
  
  for (let i = 0; i < arr.length; i++) {
    let val = arr[i];
    sum += val;
    count++;
    if (val < min) min = val;
    if (val > max) max = val;
  }
  
  // 返回 min + max + sum 的组合作为结果
  return min + max + sum;
}

