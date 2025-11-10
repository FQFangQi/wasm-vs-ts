# 快速开始指南

## 环境要求

- Node.js 20.19+ 或 22.12+ (推荐使用 22+)
- npm 或 yarn

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 编译 WebAssembly 模块

在运行项目之前，必须先编译 WASM 模块：

```bash
npm run asbuild
```

这将生成以下文件到 `build/` 目录：
- `debug.wasm` 和 `release.wasm` - 编译后的 WebAssembly 二进制文件
- `release.js` - JavaScript 加载器
- `release.d.ts` - TypeScript 类型定义

### 3. 启动开发服务器

```bash
npm run dev
```

在浏览器中打开显示的本地地址（通常是 `http://localhost:5173`）

### 4. 运行基准测试

1. 点击"运行基准测试"按钮
2. 等待所有测试完成
3. 查看图表和表格中的性能对比结果

## 常见问题

### Q: "Failed to resolve import" 错误

**A**: 确保已经运行了 `npm run asbuild` 编译 WASM 模块。

### Q: Node.js 版本不兼容

**A**: 项目需要 Node.js 20.19+ 或 22.12+。请升级您的 Node.js 版本。

可以使用以下命令检查版本：
```bash
node --version
```

### Q: WASM 模块加载失败

**A**: 
1. 确保运行了 `npm run asbuild`
2. 检查 `build/` 目录中是否有 `release.wasm` 和 `release.js` 文件
3. 清除浏览器缓存并重新加载页面

## 生产部署

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 开发工作流

1. 修改 `assembly/` 中的 AssemblyScript 代码
2. 运行 `npm run asbuild` 重新编译
3. 刷新浏览器查看更改
4. 如果修改了 React 组件，Vite 会自动热更新

## 添加新的测试用例

1. 在 `assembly/` 中添加新的测试函数
2. 在 `src/benchmarks/` 中添加对应的 TypeScript 实现
3. 在 `src/components/BenchmarkRunner.tsx` 中添加测试用例
4. 运行 `npm run asbuild` 重新编译
5. 刷新页面并运行测试

