# Cozyology Measurement Tool 项目功能与流程梳理

本文基于当前仓库代码整理，重点说明项目的主要功能、入口方式、核心状态、两个业务组件的页面流程与结果计算逻辑，便于后续维护和迭代。

## 1. 项目定位

这是一个基于 Vite + React + TypeScript 的测量工具仓库，当前包含两套业务流程：

- `MeasurementTool`：Shade/Blinds 测量流程
- `MeasurementDrapery`：Drapery/Curtain 测量流程

项目同时支持两种运行方式：

- 开发模式下，直接在页面挂载 React 组件
- 生产集成时，通过 `cozyology-measurement-tool` Web Component 挂载到宿主页面

## 2. 核心入口与运行方式

### 2.1 开发模式入口

文件：`src/main.tsx`

- 直接查找 `#measurement-tool-app` 并挂载 React
- 当前默认启用的是 `MeasurementDrapery`
- `MeasurementTool` 入口仍在文件中，但被注释掉了

这意味着本地 `npm run dev` 时，当前主要调试的是窗帘流程。

### 2.2 组件库 / Web Component 入口

文件：`src/index.ts`

- 注册自定义元素：`cozyology-measurement-tool`
- 在 `connectedCallback` 中创建 Shadow DOM
- 可通过 `type` 属性切换渲染组件：
  - `type="measurement"` -> `MeasurementTool`
  - `type="drapery"` -> `MeasurementDrapery`
- 可通过 `data-style-url` 为 Shadow DOM 注入外部样式

当前 `getProps()` 还是空实现，说明 Web Component 现在主要依赖全局配置，而不是属性透传。

### 2.3 全局配置来源

文件：`index.html`

页面中定义了两套全局对象：

- `window.CozyologyConfig`
- `window.CozyologyConfig_Drapery`

两套配置都包含：

- `shopNowUrl`
- `stepTitles`
- `resultTexts`
- `contactDetails`
- `contactBookNowUrl`
- `measurementConfig`

其中 `MeasurementDrapery` 额外依赖：

- `trackSelectorOptions`
- `trackSelectorSingleOptions`
- `resultPageTip`

可以把 `index.html` 理解为当前流程编排中心，页面跳转、输入项、图片、文案、推荐逻辑所需的大部分元数据都从这里进入。

## 3. 共享交互模型

两个主组件都采用类似的“配置驱动 + 本地状态机”结构。

### 3.1 共享状态

`MeasurementTool.tsx` 和 `MeasurementDrapery.tsx` 都维护了这些关键状态：

- `currentStep`：当前实际步骤
- `completedSteps`：已完成的实际步骤
- `stepHistory`：用户访问历史，用于“Previous”和主步骤回跳
- `inputValues`：已保存的输入值
- `currentStepInputs`：当前页正在编辑的输入值
- `inputErrors`：输入校验错误
- `selectedOptions`：各选择步骤所选 option id

### 3.2 主步骤与实际步骤

两个组件都区分：

- 主步骤：左侧/顶部 Step 进度条使用
- 实际步骤：真正执行的细分流程节点

例如：

- `MeasurementTool` 的主步骤是 `step-1 / step-2 / step-3 / step-finished`
- `MeasurementDrapery` 的主步骤是 `step-1 / step-2 / step-3 / step-4`

主步骤点击时，并不是简单跳回固定页，而是：

- 优先回到该主步骤下最后一次访问的实际步骤
- 如果没有历史记录，则根据默认分支推导入口步骤

### 3.3 配置驱动页面类型

`measurementConfig` 中每一步有 `type` 字段，当前支持：

- `select`：卡片选择页
- `input`：数值输入页
- `finished`：结果页

每个节点通过 `jump` 指向下一步，形成前端流程图。

### 3.4 通用交互行为

- 输入步骤点击 `CONTINUE` 前会做校验
- 输入合法后，值会落入 `inputValues`
- 在移动端继续下一步时会自动滚动到顶部
- 从第 1 步重新选择时，会清空后续历史和输入，重新开始流程
- `CALCULATE AGAIN` 会重置整个流程状态

## 4. MeasurementTool（Shade）流程

文件：`src/components/MeasurementTool.tsx`

### 4.1 主流程结构

主步骤共 4 段：

1. 选择安装方式
2. 输入宽度相关数据
3. 输入高度相关数据并选择长度风格
4. 输出推荐成品尺寸

### 4.2 Step 1：Choose Mount Style

起始页 `step-1` 提供两个分支：

- `inside-mount` -> `step-2-1-1`
- `outside-mount` -> `step-2-2-1`

### 4.3 Inside Mount 分支

路径：

- `step-2-1-1`：输入 3 个内框宽度
- `step-3-1-1`：输入 3 个高度
- `step-3-1-2`：选择长度风格
- `step-finished`

结果计算规则：

- 宽度 = 三次宽度测量的最小值 - `3/8"`
- 高度 = 三次高度测量的最大值
- 若长度风格为 `Puddles on Window Frame`，高度额外 `+2"`

结果展示时还会回显：

- Mount Style
- Length Style
- Window Width 的极值
- Window Height 的极值

### 4.4 Outside Mount 分支

路径：

- `step-2-2-1`：输入窗框外沿宽度
- `step-2-2-2`：输入左右额外延伸
- `step-3-2-1`：输入窗框外沿高度
- `step-3-2-2`：输入上方安装延伸
- `step-3-2-3`：选择长度风格
- `step-finished`

结果计算规则：

- 宽度 = 窗宽 + 左延伸 + 右延伸
- 高度 = 窗高 + 上延伸
- 若长度风格为 `Puddles on Window Frame`，高度额外 `+2"`

结果页右侧会通过 `SelectedInfos` 展示外装相关原始输入。

### 4.5 数值格式处理

`MeasurementTool` 结果会统一转换成接近 `1/8"` 精度的分数字符串，例如：

- `24.375` -> `24 3/8`

## 5. MeasurementDrapery（Curtain）流程

文件：`src/components/MeasurementDrapery.tsx`

这是当前仓库里更复杂的一套状态机，主步骤为：

1. Header Style
2. Width / Hardware 前置信息
3. Height / Length Style
4. Panel 及结果

### 5.1 Step 1：选择帘头样式

`step-1` 可选 4 个帘头：

- `pleated`
- `ripple-fold`
- `soft-top`
- `grommets`

不同帘头会影响：

- Step 2 的默认起点
- 宽高计算公式
- 是否使用 Track Selector
- 结果页标题与硬件展示

### 5.2 Soft Top / Grommets 流程

这两种帘头逻辑最接近。

Step 2 分支：

- 已装杆 `rod-installed-yes`
  - 输入杆长 `rod-width-top-2`
  - 进入高度 `step-3-1-0`
- 未装杆 `rod-installed-no`
  - 输入窗宽 `norod-window-width-2`
  - 输入左右延伸 `norod-width-left-extension-2 / norod-width-right-extension-2`
  - 输入窗顶到地面高度 `top-to-floor-height-2`
  - 输入杆高出窗框距离 `rod-extension-above-frame-3`

高度计算：

- 已装杆：直接使用 `rod-top-to-floor-height-2`
- 未装杆：`top-to-floor-height-2 + rod-extension-above-frame-3`

帘头补偿：

- `soft-top`：额外 `+0.5"`
- `grommets`：额外 `+1"`

之后统一再经过 Curtain Length Style 调整：

- `1" ABOVE FLOOR` -> `-1"`
- `BREAK ON THE FLOOR` -> `0`
- `SLIGHT PUDDLE ON FLOOR` -> `+1"`

宽度计算：

- 已装杆：直接取杆长
- 未装杆：窗宽 + 左右延伸
- 若选择 `Split Panels`，最终宽度对半

### 5.3 Pleated 流程

Pleated 是最复杂的分支，核心先分两层：

- 是否已安装 `rod / track`
- 使用 `Rod` 还是 `Track`

#### 5.3.1 Pleated -> 已安装

路径入口：

- `step-2-0-0` 选择是否已装 `rod / track`
- `step-2-0-2` 选择硬件类型 `ROD / TRACK`

已安装 Rod：

- 宽度：`rod-width-top`
- 高度：`rod-top-to-floor-height`
- 长度风格调整后得到最终高度
- 若 `Split Panels`，宽度对半

已安装 Track：

- 宽度：`hardware-track-length-2`
- 再选择硬件展示方式：
  - `hardware-visible` -> 使用 `track-bottom-to-floor-height`
  - `hardware-covered` -> 使用 `track-top-to-floor-height`
- 高度再经过长度风格调整
- 若 `Split Panels`，宽度对半

#### 5.3.2 Pleated -> 未安装 -> Rod

路径：

- `step-2-2-1` 窗宽
- `step-2-2-2` 左右延伸
- `step-3-2-1` 窗顶到地
- `step-3-1-2` 杆高出窗框
- `step-3-1-3` 长度风格

结果计算：

- 宽度 = 窗宽 + 左延伸 + 右延伸
- 高度 = `top-to-floor-height + rod-extension-above-frame - 1"`
- 再经过长度风格调整
- `Split Panels` 时宽度对半

这里的 `-1"` 是 pleated + rod 的固定扣减。

#### 5.3.3 Pleated -> 未安装 -> Track

路径先输入：

- 窗宽 `notrack-window-width`
- 左右延伸 `notrack-width-left-extension / notrack-width-right-extension`
- 安装方式 `hardware-ceiling-mount / hardware-wall-mount`

再分 Ceiling Mount / Wall Mount。

Ceiling Mount：

- 输入 `track-ceiling-to-floor-height`
- 选择硬件 `Visible / Covered`
- 若 Visible，则还要输入 `track-ring-ceiling-to-bottom-height`

Wall Mount：

- 输入 `wall-mount-top-to-floor-height`
- 输入 `rod-extension-above-frame-2`
- 选择硬件 `Visible / Covered`
- 若 Visible，则输入 `track-ring-ceiling-to-bottom-height-2`

结果计算核心：

- 宽度 = 窗宽 + 左右延伸
- `Split Panels` 时宽度对半
- 高度基于天花板/窗顶到地面的高度
- 若是 Visible，需要减去硬件到底部的距离
- 若是 Covered，则不减这个值
- 之后统一再经过长度风格调整

### 5.4 Ripple Fold 流程

Ripple Fold 当前走的是单独的新流程。

Step 2：

- 输入窗宽 `ripplefold-notrack-window-width`
- 输入左右延伸 `ripplefold-notrack-width-left-extension / ripplefold-notrack-width-right-extension`
- 选择安装方式：
  - `ripplefold-hardware-ceiling-mount`
  - `ripplefold-hardware-wall-mount`

Step 3：

Ceiling Mount：

- `ripplefold-track-ceiling-to-floor-height`
- `ripplefold-ring-ceiling-to-bottom-height`

Wall Mount：

- `ripplefold-window-top-to-floor-height`
- `ripplefold-extension-above-frame`
- `ripplefold-how-to-hardware-height`

结果计算：

- 宽度 = 窗宽 + 左右延伸
- 若 `Split Panels`，宽度对半
- Ceiling Mount 高度 = `ceiling-to-floor - hardware distance`
- Wall Mount 高度 = `top-to-floor + extension-above-frame - hardware distance`
- 最后再经过长度风格调整

### 5.5 长度风格与 Panel

多数 Drapery 分支都会在 `step-3-1-3` 选择 Curtain Length Style：

- `1" ABOVE FLOOR`
- `BREAK ON THE FLOOR`
- `SLIGHT PUDDLE ON FLOOR`

随后进入 `step-4-1` 选择：

- `SINGLE`
- `SPLIT`

最终结果页在 `step-4-2`。

其中：

- `SINGLE` -> 结果宽度保持不变
- `SPLIT` -> 结果宽度按单片展示，因此总宽度会被二分

结果页显示的是单片建议下单尺寸，数量通过 `Quantity` 单独标识。

## 6. 特殊输入组件与工具函数

### 6.1 TrackSelector

文件：`src/components/TrackSelector.tsx`

用于 Pleated 的硬件厚度/距离选择，支持两种来源：

- `Cozyology Hardware`
- `My Hardware`

特点：

- 选择 Cozyology 硬件时，用预设 option 值参与计算
- 选择 My Hardware 时，允许手动输入
- 手动输入支持整数、小数、分数、带分数

### 6.2 TrackSelectorSingle

文件：`src/components/TrackSelectorSingle.tsx`

用于 Ripple Fold 的硬件选择，当前只提供 Cozyology 预设下拉，不提供双 tab。

### 6.3 分数处理工具

文件：`src/utils/index.ts`

与 Drapery 相关的重点能力：

- `mixNumberOrFractionHandle`
  - 解析 `1 5/8`、`5/8` 这类输入
- `parseMixedNumberAndSum`
- `convertToMixedNumber`

这套工具支撑了窗帘流程里硬件厚度、轨道高度等“英寸分数输入”能力。

## 7. 结果页组成

两个结果页都包含以下核心区域：

- 推荐尺寸
- 关键属性摘要
- 原始输入回显
- `SHOP NOW`
- `CALCULATE AGAIN`
- 截图提醒

其中：

- `MeasurementTool` 的结果摘要更偏 Shade 安装方式
- `MeasurementDrapery` 的结果摘要会强调：
  - Header
  - Fullness
  - Quantity
  - Hardware

## 8. 共享子组件

### 8.1 SelectedInfos

文件：`src/components/SelectedInfos.tsx`

用于结果页右侧 “You've selected” 区块，负责展示用户原始选择与测量输入。

### 8.2 ContactQrcode

文件：`src/components/ContactQrcode.tsx`

用于桌面/移动端展示咨询入口，包括：

- Zoom consultation
- 联系弹窗触发
- Book Now

它会根据 `type` 使用不同配置中的 `contactBookNowUrl`，但部分文案和外链仍然是组件内硬编码。

## 9. 当前实现的维护注意点

### 9.1 实际配置中心在 `index.html`

虽然项目是 React 组件化写法，但业务流程并不在独立 JSON 或 TS 配置文件中，而是大量写在 `index.html` 的全局对象里。后续如果调整流程，通常需要同时看：

- `index.html`
- `MeasurementTool.tsx`
- `MeasurementDrapery.tsx`

### 9.2 README 与当前实现并不完全一致

当前 README 里仍包含较泛化的说明，例如把项目描述成通用测量工具、展示了并不存在的 props 用法；维护时应优先以代码实现为准。

### 9.3 Web Component 属性能力还比较弱

`src/index.ts` 中 `getProps()` 为空，说明当前 Web Component 对宿主页面传参支持有限，主要仍依赖全局变量。

### 9.4 开发默认入口只渲染 Drapery

如果要调试 Shade 流程，需要先修改 `src/main.tsx` 中当前挂载的组件。

## 10. 一句话总结

当前项目本质上是一个“由全局配置驱动的多分支测量状态机”，其中：

- `MeasurementTool` 负责 Shade 的 inside/outside mount 测量
- `MeasurementDrapery` 负责 Drapery 的 header/hardware/panel 组合测量
- `index.html` 提供流程定义
- 组件负责状态管理、输入校验、跳转控制和结果计算
