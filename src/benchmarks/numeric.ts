/**数值计算测试 - TypeScript 版本*/

/**斐波那契数列 (递归版本)*/
export function fibonacciRecursive(n: number): number {
  if (n <= 1) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

/**斐波那契数列 (迭代版本)*/
export function fibonacciIterative(n: number): number {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

  /**矩阵乘法 (n x n)*/
export function matrixMultiply(n: number): number {
  // 初始化矩阵
  const matrixA: number[][] = [];
  const matrixB: number[][] = [];
  const matrixC: number[][] = [];

  for (let i = 0; i < n; i++) {
    matrixA[i] = [];
    matrixB[i] = [];
    matrixC[i] = [];
    
    for (let j = 0; j < n; j++) {
      matrixA[i][j] = i + j;
      matrixB[i][j] = i - j;
      matrixC[i][j] = 0;
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

/**快速排序*/
export function quickSort(arr: number[], start: number, end: number): void {
  if (start >= end) return;
  
  const pivotIndex = partition(arr, start, end);
  quickSort(arr, start, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, end);
}

function partition(arr: number[], start: number, end: number): number {
  const pivot = arr[end];
  let i = start - 1;
  
  for (let j = start; j < end; j++) {
    if (arr[j] <= pivot) {
      i++;
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  
  const temp = arr[i + 1];
  arr[i + 1] = arr[end];
  arr[end] = temp;
  
  return i + 1;
}

/**质数计算 (埃拉托斯特尼筛法)*/
export function sieveOfEratosthenes(n: number): number {
  const isPrime: boolean[] = new Array(n + 1).fill(true);
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

