// 共享类型定义

export interface Result {
  name: string;
  category: string;
  categoryKey: string; // 类别的翻译键
  testKey: string; // 测试类型的翻译键
  params?: Record<string, number>; // 测试参数
  wasm: { average: number; min: number; max: number; stdDev: number };
  ts: { average: number; min: number; max: number; stdDev: number };
  comparison: { speedup: number; improvementPercent: number; wasmFaster: boolean };
}

