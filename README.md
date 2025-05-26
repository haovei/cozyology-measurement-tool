# Cozyology Measurement Tool

一个基于 React + TypeScript + Tailwind CSS 的 Web Components 测量工具，使用 Vite 构建。

## 功能特性

- 📏 图像测量工具
- 🎯 精确的点对点测量
- 📐 可自定义比例尺和单位
- 🎨 支持明暗主题
- 📦 可作为 Web Component 使用
- 🚀 现代化的开发体验

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Vite** - 构建工具
- **Web Components** - 可重用组件

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 使用方法

### 作为 React 组件

```tsx
import { MeasurementTool } from './components/MeasurementTool'

function App() {
  return (
    <MeasurementTool 
      title="我的测量工具" 
      theme="light" 
    />
  )
}
```

### 作为 Web Component

```html
<cozyology-measurement-tool 
  data-title="Custom Measurement Tool" 
  data-theme="dark">
</cozyology-measurement-tool>
```

## 测量步骤

1. 上传图像文件
2. 设置比例尺（像素/单位）
3. 选择测量单位
4. 在图像上点击两点进行测量
5. 查看测量结果

## 许可证

MIT License
