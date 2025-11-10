// WASM 加载器

import type * as AssemblyScript from '../../build/release.js';

export type WasmModule = typeof AssemblyScript;
let wasmModule: WasmModule | null = null;

// 加载 WASM 模块
export async function loadWasm(): Promise<WasmModule> {
  if (wasmModule) {
    return wasmModule;
  }
  
  try {
    const module = await import('../../build/release.js');
    wasmModule = module;
    return module;
  } catch (error) {
    console.error('Failed to load WASM module:', error);
    throw new Error('Failed to load WASM module. Make sure to run "npm run asbuild" first.');
  }
}

// 获取已加载的模块
export function getWasmModule(): WasmModule | null {
  return wasmModule;
}

