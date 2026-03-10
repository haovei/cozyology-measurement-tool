# MeasurementDrapery 问题修复清单

本文档用于记录 `MeasurementDrapery` 组件当前已确认的问题，并按优先级逐步修复。

## 高优先级 Bug

### 1. Pleated -> No -> Track -> Wall Mount 结果摘要字段取错
- 位置：`src/components/MeasurementDrapery.tsx`
- 问题：结果页 `Top-of-Window to Floor` 误用了 `notrack-window-width`
- 正确字段：`wall-mount-top-to-floor-height`
- 影响：结果页“已选信息”展示错误，容易误导业务核对

### 2. 主步骤导航回跳列表不完整
- 位置：`src/components/MeasurementDrapery.tsx`
- 问题：`getActualStepFromMainStep()` 中维护的步骤列表与配置不一致，遗漏多个真实子步骤
- 影响：点击 Step 2 / Step 3 / Step 4 时，可能无法回到用户最后访问的真实步骤

### 3. 分数/带分数输入校验与保存规则不一致
- 位置：`src/components/MeasurementDrapery.tsx`
- 问题：输入校验依赖 `parseFloat`，保存时却按 `Number(value)` 判断，导致 `7/8`、`1 1/8` 等输入行为不一致
- 影响：部分输入可能“校验通过但计算异常”或“展示与计算规则不一致”

## 中优先级 优化项

### 4. `getAdditionalInfoForCurrentStep()` 存在死代码
- 位置：`src/components/MeasurementDrapery.tsx`
- 问题：函数中途提前 `return`，后续 fallback 分支永远不会执行
- 影响：增加理解成本，后续维护者容易误判真实逻辑

### 5. 未使用的旧 Ripple Fold 逻辑残留
- 位置：`src/components/MeasurementDrapery.tsx`
- 问题：`calculateRippleFoldSize()` 目前未被使用，且周围保留了大量旧注释和废弃方案
- 影响：代码噪音高，阅读和修改成本偏大

### 6. 组件导出函数命名与文件名不一致
- 位置：`src/components/MeasurementDrapery.tsx`
- 问题：文件名为 `MeasurementDrapery.tsx`，默认导出函数名却仍为 `MeasurementTool`
- 影响：调试、搜索和团队协作时易混淆

## 当前修复顺序

1. 修复结果摘要字段取错
2. 修复主步骤导航回跳列表不完整
3. 统一分数输入校验与保存规则
4. 清理死代码与旧逻辑残留
