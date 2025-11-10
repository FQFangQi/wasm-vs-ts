// 数值计算测试 - AssemblyScript 版本

// 斐波那契数列 (递归版本)
export function fibonacciRecursive(n: i32): i32 {
  if (n <= 1) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// 斐波那契数列 (迭代版本)
export function fibonacciIterative(n: i32): i32 {
  if (n <= 1) return n;
  let a: i32 = 0, b: i32 = 1;
  for (let i: i32 = 2; i <= n; i++) {
    let temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

// 矩阵乘法 (n x n)
export function matrixMultiply(n: i32): f64 {
  // 初始化矩阵
  let matrixA = new Array<Array<f64>>(n);
  let matrixB = new Array<Array<f64>>(n);
  let matrixC = new Array<Array<f64>>(n);

  for (let i = 0; i < n; i++) {
    matrixA[i] = new Array<f64>(n);
    matrixB[i] = new Array<f64>(n);
    matrixC[i] = new Array<f64>(n);
    
    for (let j = 0; j < n; j++) {
      matrixA[i][j] = <f64>i + <f64>j;
      matrixB[i][j] = <f64>i - <f64>j;
      matrixC[i][j] = 0.0;
    }
  }

  // 矩阵乘法
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        matrixC[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }

  // 返回一个元素作为结果
  return matrixC[0][0];
}

// 快速排序
export function quickSort(arr: Int32Array, start: i32, end: i32): void {
  if (start >= end) return;
  
  let pivotIndex = partition(arr, start, end);
  quickSort(arr, start, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, end);
}

function partition(arr: Int32Array, start: i32, end: i32): i32 {
  let pivot = arr[end];
  let i = start - 1;
  
  for (let j = start; j < end; j++) {
    if (arr[j] <= pivot) {
      i++;
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  
  let temp = arr[i + 1];
  arr[i + 1] = arr[end];
  arr[end] = temp;
  
  return i + 1;
}

// 质数计算 (埃拉托斯特尼筛法)
export function sieveOfEratosthenes(n: i32): i32 {
  let isPrime = new Array<bool>(n + 1);
  for (let i = 0; i <= n; i++) {
    isPrime[i] = true;
  }
  
  isPrime[0] = false;
  isPrime[1] = false;
  
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  
  let count = 0;
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) {
      count++;
    }
  }
  
  return count;
}

