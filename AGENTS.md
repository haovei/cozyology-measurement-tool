# Repository Guidelines

## Project Structure & Module Organization
本仓库是基于 Vite 的 React + TypeScript 测量工具，并同时暴露 Web Component。

- 根目录关键文件：`package.json` 定义脚本与构建入口，`vite.config.ts` 负责打包配置，`tailwind.config.js` 管理样式扫描与主题扩展，`index.html` 用于本地开发挂载。
- `src/main.tsx`: 开发模式入口，直接挂载 React 组件，便于调试页面流程。
- `src/index.ts`: 组件库入口，负责注册 `cozyology-measurement-tool` 自定义元素，并在 Shadow DOM 中挂载 React。
- `src/components/`: 业务组件层。`MeasurementTool.tsx` 与 `MeasurementDrapery.tsx` 是两条主流程，`TrackSelector*.tsx`、`SelectedInfos.tsx`、`ContactQrcode.tsx` 为可复用子模块。
- `src/assets/`: 大量测量步骤图片、窗帘流程图片、二维码和字体资源；新增素材应继续按业务前缀归类，如 `drapery-*`。
- `src/styles/`: 补充样式文件，目前包含图片相关样式。
- `src/types/`: 静态资源和全局对象声明，避免导入图片或挂载全局配置时报错。
- `src/utils/`: 通用函数入口，适合放与 UI 解耦的纯逻辑。
- `dist/`: 构建产物目录，只用于发布和预览，不直接手改。

## Build, Test, and Development Commands
- `npm run dev`: 启动本地开发服务器，默认监听局域网
- `npm run build`: 先执行 TypeScript 编译，再执行 Vite 打包
- `npm run preview`: 预览 `dist/` 中的构建结果
- `npm run type-check`: 只做类型检查，不产出文件
- `npm run format`: 按 Prettier 规则格式化 `src/` 下代码
- `npm run format:check`: 检查格式是否符合规范
- `npm run lint`: 运行 ESLint；使用前先确认本地 ESLint 配置可用

示例：`npm run dev`、`npm run build`

## Coding Style & Naming Conventions
统一使用 2 空格缩进、单引号、无分号、`printWidth: 120`，以 `.prettierrc.json` 为准。React 组件文件使用 PascalCase 命名，例如 `TrackSelectorSingle.tsx`；工具函数与普通模块使用 camelCase。新增静态资源请放入 `src/assets/`，文件名尽量延续现有业务前缀，如 `drapery-03-*.webp`。

## Testing Guidelines
当前仓库未配置 Vitest、Jest 或 Playwright，提交前至少执行 `npm run type-check` 与 `npm run build`。如果新增复杂分支逻辑，建议同步补充可自动执行的测试，并将测试文件放在对应模块附近，命名可采用 `*.test.ts` 或 `*.test.tsx`。

项目目前没有独立 `tests/` 目录；若后续引入测试，优先采用“与模块同目录共置”的方式，减少测量流程组件与资源文件之间的跳转成本。

## Commit & Pull Request Guidelines
现有提交历史以简短前缀为主：`feat:`、`pref:`、`style:`。请继续使用“类型 + 冒号 + 中文摘要”的格式，例如 `feat: 新增窗帘结果页跳转逻辑`。PR 应包含变更目的、主要改动、验证方式；若涉及 UI，请附截图或录屏，并说明是否影响 `MeasurementTool`、`MeasurementDrapery` 或 Web Component 输出。

## Security & Configuration Tips
不要提交密钥、私有接口地址或临时调试配置。修改自定义元素行为时，优先检查 `src/index.ts` 中的属性映射与 Shadow DOM 挂载逻辑，避免破坏外部宿主页面集成。
