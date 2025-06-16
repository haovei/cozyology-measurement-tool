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
import stepConfig from './assets/step-config.json'

function App() {
  return (
    <MeasurementTool 
      stepConfig={stepConfig}
      shopNowUrl="https://example.com/shop"
    />
  )
}
```

### 作为 Web Component

```html
<cozyology-measurement-tool 
  shop-now-url="https://example.com/shop">
</cozyology-measurement-tool>
```

### 自定义配置

您可以通过全局变量 `window.CozyologyMeasurementConfig` 来自定义步骤配置：

```html
<script>
// 在加载 web component 之前设置全局配置
window.CozyologyMeasurementConfig = {
  "step-1": {
    "title": "自定义标题",
    "type": "select",
    "options": [
      {
        "id": "custom-option",
        "title": "自定义选项",
        "imageClass": "custom-image-class",
        "description": "自定义描述",
        "jump": "next-step"
      }
    ]
  }
  // 更多自定义配置...
};
</script>

<cozyology-measurement-tool shop-now-url="https://example.com/shop">
</cozyology-measurement-tool>
```

#### 配置结构

配置文件结构如下，支持多种类型的步骤：

- `select` - 选择类型步骤，用户从多个选项中选择一个
- `input` - 输入类型步骤，用户输入数值
- `finished` - 完成步骤

每个步骤可以包含：
- `title` - 步骤标题
- `type` - 步骤类型（select/input/finished）
- `imageClass` - 图片 CSS 类名
- `description` - 步骤描述
- `jump` - 下一步的步骤 ID
- `options` - 选项列表（针对 select 和 input 类型）

查看 `example-custom-config.html` 文件获取完整的自定义配置示例。

## 使用方法

### 基本使用

工具提供了多种安装方式的测量指导：

1. **选择安装方式** - 内装式或外装式
2. **测量尺寸** - 根据提示测量窗户宽度和高度
3. **选择样式** - 确定最终的遮阳帘长度样式
4. **获取结果** - 获得准确的测量数据用于订购

## 许可证

MIT License
