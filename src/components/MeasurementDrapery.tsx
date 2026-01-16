'use client'

import { useRef, useState, useMemo } from 'react'
import TrackSelector from './TrackSelector'
import SelectedInfos from './SelectedInfos'
import { mixNumberOrFractionHandle, convertToMixedNumber, fractionOperation } from '../utils'
import { TRACK_SELECTOR_TYPE } from './TrackSelector'

const CozyologyConfig = window.CozyologyConfig_Drapery

export default function MeasurementTool() {
  const [currentStep, setCurrentStep] = useState('step-1')
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [stepHistory, setStepHistory] = useState<string[]>(['step-1']) // 记录步骤历史
  const [inputValues, setInputValues] = useState<Record<string, any>>({}) // 记录所有输入值
  const [currentStepInputs, setCurrentStepInputs] = useState<Record<string, string>>({}) // 当前步骤的输入值
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({}) // 输入错误信息
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({}) // 记录每个步骤选择的选项ID
  const [showTooltip, setShowTooltip] = useState(false) // 控制工具提示显示
  const [selectorTabKey, setSelectorTabKey] = useState<TRACK_SELECTOR_TYPE>()

  const headerStyle = useMemo(() => {
    return selectedOptions['step-1']
  }, [selectedOptions])

  // 是否展示额外信息（fullness 和 hardware）
  const showExtraResultInfos = useMemo(() => {
    return ['ripple-fold', 'pleated', 'soft-top', 'grommets'].includes(headerStyle)
  }, [selectedOptions])

  // 默认返回第4-1步骤的结果
  const isSplitPanels = useMemo(() => selectedOptions['step-4-1'] === 'split-panels', [selectedOptions])

  const getCurrentMainStep = (): string => {
    if (currentStep === 'step-1') return 'step-1'
    if (currentStep.startsWith('step-2')) return 'step-2'
    if (currentStep.startsWith('step-3')) return 'step-3'
    if (currentStep.startsWith('step-4')) return 'step-4'
    return 'step-1'
  }

  const isStepCompleted = (stepKey: string): boolean => {
    switch (stepKey) {
      case 'step-1':
        return completedSteps.includes('step-1')
      case 'step-2':
        return completedSteps.some(step => step.startsWith('step-2'))
      case 'step-3':
        return completedSteps.some(step => step.startsWith('step-3'))
      case 'step-4':
        return completedSteps.some(step => step.startsWith('step-4'))
      default:
        return false
    }
  }

  // 定义主要步骤列表
  const mainSteps = ['step-1', 'step-2', 'step-3', 'step-4']
  const steps = mainSteps.map((key, index) => ({
    id: key,
    stepNumber: index + 1,
    title: getStepTitle(key),
    active: getCurrentMainStep() === key,
    completed: isStepCompleted(key),
  }))

  function getStepTitle(stepKey: string): string {
    return CozyologyConfig.stepTitles?.[stepKey] || 'Step'
  }

  const getPreviousStep = () => {
    // 基于历史记录返回上一步
    const currentIndex = stepHistory.indexOf(currentStep)
    return currentIndex > 0 ? stepHistory[currentIndex - 1] : null
  }

  const handleStepNavigation = (stepId: string) => {
    // 只允许点击已完成的步骤或当前步骤
    if (isStepCompleted(stepId) || stepId === getCurrentMainStep()) {
      // 根据主步骤ID找到对应的实际步骤
      const targetStep = getActualStepFromMainStep(stepId)

      // 如果点击的是已完成的步骤，从历史记录中找到对应的步骤
      if (isStepCompleted(stepId) && stepId !== getCurrentMainStep()) {
        // 从历史记录中找到最后一次访问该主步骤的具体步骤
        const historyForMainStep = stepHistory.filter(step => {
          const mainStep = getMainStepFromActualStep(step)
          return mainStep === stepId
        })

        if (historyForMainStep.length > 0) {
          const lastVisitedStep = historyForMainStep[historyForMainStep.length - 1]
          setCurrentStep(lastVisitedStep)
          restoreInputsForStep(lastVisitedStep)
          return
        }
      }

      setCurrentStep(targetStep)
      restoreInputsForStep(targetStep)
    }
  }

  const getMainStepFromActualStep = (actualStep: string): string => {
    if (actualStep === 'step-1') return 'step-1'
    if (actualStep.startsWith('step-2')) return 'step-2'
    if (actualStep.startsWith('step-3')) return 'step-3'
    if (actualStep.startsWith('step-4')) return 'step-4'
    return 'step-1'
  }

  const getActualStepFromMainStep = (mainStepId: string): string => {
    switch (mainStepId) {
      case 'step-1':
        return 'step-1'
      case 'step-2':
        // 返回已完成的最后一个step-2子步骤，或第一个step-2步骤
        const step2Options = [
          'step-2-0',
          'step-2-0-0',
          'step-2-0-1',
          'step-2-0-2',
          'step-2-1-1',
          'step-2-2-1',
          'step-2-2-2',
          'step-2-2-3',
          'step-2-2-4',
        ]
        const completedStep2 = step2Options.filter(step => completedSteps.includes(step))
        return completedStep2.length > 0 ? completedStep2[completedStep2.length - 1] : 'step-2-0'
      case 'step-3':
        // 返回已完成的最后一个step-3子步骤，或根据Rod Installed状态确定第一个step-3步骤
        const step3Options = [
          'step-3-1-1',
          'step-3-2-1',
          'step-3-1-2',
          'step-3-1-3',
          'step-3-1-4',
          'step-3-1-5',
          'step-3-2-2',
        ]
        const completedStep3 = step3Options.filter(step => completedSteps.includes(step))
        if (completedStep3.length > 0) {
          return completedStep3[completedStep3.length - 1]
        }
        // 根据Rod Installed状态决定起始步骤
        const hasRodInstalled = selectedOptions['step-2-0'] === 'rod-installed-yes'
        return hasRodInstalled ? 'step-3-1-1' : 'step-3-2-1'
      case 'step-4':
        // 返回已完成的最后一个step-4子步骤，或第一个step-4步骤
        let defaultStep = 'step-4-1'
        // ripple-fold 没有 step-4-1这一步
        if (selectedOptions?.['step-1'] === 'ripple-fold') defaultStep = 'step-4-2'
        const step4Options = ['step-4-1', 'step-4-2']
        const completedStep4 = step4Options.filter(step => completedSteps.includes(step))
        return completedStep4.length > 0 ? completedStep4[completedStep4.length - 1] : defaultStep
      default:
        return 'step-1'
    }
  }

  // 验证当前步骤的所有输入是否都已填写，返回验证结果和错误信息
  const validateCurrentStepInputs = (): { isValid: boolean; errors: string[] } => {
    if (currentStepData.type !== 'input') return { isValid: true, errors: [] }

    const errors: string[] = []

    currentStepData.options.forEach(option => {
      const value = currentStepInputs[option.id]
      const numValue = parseFloat(value)
      const fieldName = option.title || option.label || option.id

      // 检查是否有值且为有效数字
      if (!value || value.trim() === '') {
        errors.push(`${fieldName} is required`)
        return
      }

      if (isNaN(numValue)) {
        errors.push(`${fieldName} must be a valid number`)
        return
      }

      // 检查是否满足最小值要求
      if (numValue < option.min) {
        errors.push(`${fieldName} must be at least ${option.min} inches`)
        return
      }

      // 检查是否满足最大值要求（如果有）
      if (option.max && numValue > option.max) {
        errors.push(`${fieldName} must be no more than ${option.max} inches`)
        return
      }
    })

    return { isValid: errors.length === 0, errors }
  }

  // 保存当前步骤的输入值
  const saveCurrentStepInputs = () => {
    const newInputs = { ...inputValues }

    currentStepData.options.forEach(option => {
      const value = currentStepInputs[option.id]
      if (value) {
        // 非合规数字字符串保留原始值，数字字符串转成浮点数
        const isInvalidNumber = isNaN(Number(value))
        newInputs[option.id] = isInvalidNumber ? value : parseFloat(value)
      }
    })

    setInputValues(newInputs)
  }

  // 处理输入值变化
  const handleInputChange = (optionId: string, value: string) => {
    setCurrentStepInputs(prev => ({
      ...prev,
      [optionId]: value,
    }))

    // 实时验证当前输入
    validateSingleInput(optionId, value)
  }

  // 处理tab切换
  const handleTabSwitch = (option, value: TRACK_SELECTOR_TYPE) => {
    setSelectorTabKey(value)
  }

  // 验证单个输入字段
  const validateSingleInput = (optionId: string, value: string) => {
    const option = currentStepData.options.find(opt => opt.id === optionId)
    if (!option) return

    const fieldName = option.title || option.label || option.id
    let error = ''

    if (value && value.trim() !== '') {
      const numValue = parseFloat(value)

      if (isNaN(numValue)) {
        error = `${fieldName} must be a valid number`
      } else if (numValue < option.min) {
        error = `${fieldName} must be at least ${option.min} inches`
      } else if (option.max && numValue > option.max) {
        error = `${fieldName} must be no more than ${option.max} inches`
      }
    }

    setInputErrors(prev => ({
      ...prev,
      [optionId]: error,
    }))
  }

  // 恢复指定步骤的输入值
  const restoreInputsForStep = (stepId: string) => {
    const stepData = CozyologyConfig.measurementConfig[stepId]
    if (stepData && stepData.type === 'input') {
      const restoredInputs: Record<string, string> = {}

      stepData.options.forEach(option => {
        const savedValue = inputValues[option.id]
        if (savedValue !== undefined) {
          restoredInputs[option.id] = savedValue.toString()
        }
      })

      setCurrentStepInputs(restoredInputs)
    } else {
      setCurrentStepInputs({})
    }
  }

  // 将小数转换为小数格式的函数，应用自定义四舍五入规则
  const convertToDecimal = (decimal: number, returnStr: boolean = true): string | number => {
    // 处理负数或零的情况
    if (decimal <= 0) {
      return '0'
    }

    const wholeNumber = Math.floor(decimal)
    const fractionalPart = decimal - wholeNumber

    // 应用自定义四舍五入规则
    let adjustedFractionalPart: number
    if (fractionalPart < 0.1) {
      // 小于0.1的值，四舍五入到0
      adjustedFractionalPart = 0.0
    } else if (fractionalPart >= 0.1 && fractionalPart < 0.25) {
      // 0.1-0.3 之间的值，四舍五入到0
      adjustedFractionalPart = 0.0
    } else if (fractionalPart >= 0.25 && fractionalPart < 0.75) {
      // 0.3-0.7 之间的值，四舍五入到0.5
      adjustedFractionalPart = 0.5
    } else {
      // 大于0.7的值，四舍五入到1.0
      adjustedFractionalPart = 1.0
    }
    let res = wholeNumber // 默认赋值为adjustedFractionalPart===0的情况
    // 如果调整后的小数部分是1.0，则进位到整数部分
    if (adjustedFractionalPart >= 1.0) {
      res += 1
    }
    // 如果调整后的小数部分是0.5，则加上0.5
    if (adjustedFractionalPart === 0.5) {
      res += 0.5
    }
    return returnStr ? res.toString() : res
  }

  // 计算最终的推荐尺寸
  const calculateRecommendedSize = (): { width: string; height: string } => {
    console.log('结尾selectedOptions---', selectedOptions)
    console.log('结尾inputValues---', inputValues)
    console.log('结尾selectorTabKey---', selectorTabKey)

    let width: any = 0
    let height: any = 0

    if (headerStyle === 'ripple-fold') {
      // Ripple Fold新流程就计算逻辑
      ;[width, height] = calculateRippleFoldSize()
    } else if (headerStyle === 'pleated') {
      ;[width, height] = calculatePleatedSize()
    } else {
      // 判断是否已安装窗帘杆
      const hasRodInstalled = selectedOptions['step-2-0'] === 'rod-installed-yes'

      // 计算宽度
      if (hasRodInstalled) {
        // 已安装杆的情况：直接使用杆长度
        width = inputValues['rod-width-top'] || 0
      } else {
        // 未安装杆的情况：窗户宽度 + 左右延伸
        const windowWidth = inputValues['norod-window-width'] || 0
        const leftExtension = inputValues['norod-width-left-extension'] || 0
        const rightExtension = inputValues['norod-width-right-extension'] || 0
        width = windowWidth + leftExtension + rightExtension
      }

      // 根据面板类型调整宽度
      if (isSplitPanels) {
        // 分割面板：宽度减半
        width = width / 2
      }

      // 计算高度 - 第一步：计算杆到地面的距离
      let rodToFloorHeight = 0

      if (hasRodInstalled) {
        // 已安装杆的情况：直接使用杆到地面的高度
        rodToFloorHeight = inputValues['rod-top-to-floor-height'] || 0
      } else {
        // 未安装杆的情况：窗户顶部到地面的高度 + 杆在窗框上方的延伸
        const windowTopToFloorHeight = inputValues['top-to-floor-height'] || 0
        const rodExtensionAboveFrame = inputValues['rod-extension-above-frame'] || 0
        rodToFloorHeight = windowTopToFloorHeight + rodExtensionAboveFrame
      }

      // 计算高度 - 第二步：根据帘头样式调整起始高度
      // let curtainHeight = rodToFloorHeight

      // SoftTop加0.9变为加7/8，Grommets加2.8变为加2 7/8
      // const mixnumberMap = {
      //   'soft-top': '7/8',
      //   grommets: '2 7/8',
      // }

      // // 计算高度并转为带分数
      // mixNumberOrFractionHandle(mixnumberMap[headerStyle], ({ decimalValue, denominator }) => {
      //   // 加上对应带分数转换的小数再处理帘头样式高度计算
      //   curtainHeight = calculateByCurtainStyle(rodToFloorHeight + decimalValue)

      //   // 转换结果为带分数
      //   const { wholePart, fracPart } = convertToMixedNumber(curtainHeight, denominator)
      //   height = `${wholePart} ${fracPart}`
      // })

      const extraNumberMap = {
        'soft-top': 0.9,
        grommets: 2.9,
      }
      height = calculateByCurtainStyle(rodToFloorHeight + extraNumberMap[headerStyle])
    }

    // 确保宽度和高度都是正数，防止计算错误导致负值（类型为number的情况下。因为目前添加了带分数展示类型为string）
    typeof width === 'number' && (width = Math.max(width, 0))
    typeof height === 'number' && (height = Math.max(height, 0))

    return {
      width: typeof width === 'number' ? decimalToMixedNumber(convertToDecimal(width)) : width,
      height: typeof height === 'number' ? decimalToMixedNumber(convertToDecimal(height)) : height,
    }
  }

  const decimalToMixedNumber = (num: number | string) => {
    const numToStr = String(num)
    if (numToStr.endsWith('.5')) {
      const index = numToStr.indexOf('.5')
      return numToStr.slice(0, index) + ' 1/2'
    }
    return num
  }

  // 提取出来的原calculateRecommendedSize方法中的第三步，根据窗帘长度样式调整高度
  const calculateByCurtainStyle = (curtainHeight: number) => {
    const lengthStyle = selectedOptions['step-3-1-3']
    console.log('长度样式 - lengthStyle:', lengthStyle)
    if (lengthStyle === 'length-style-above-floor') {
      // 离地面1英寸
      return curtainHeight - 1
    } else if (lengthStyle === 'length-style-breaks-on-floor') {
      // 接触地面：使用计算出的高度
      return curtainHeight
    } else if (lengthStyle === 'length-style-puddles-on-floor') {
      // 轻微堆积在地面：增加1英寸
      return curtainHeight + 1
    }
    // 默认情况
    return curtainHeight
  }

  // 计算新流程中Ripple Fold的结果
  const calculateRippleFoldSize = (): [number, number] => {
    /**
     * 这里hardware在step-2-0-1没值是默认取’hardware-Track‘,既满足了第一步选择ripple-fold直接跳转step-2-2-3(step-2-0-1没有值)的新逻辑
     * 又不影响pleated本身走step-2-0-1的逻辑
     * 之前逻辑ripple-fold需要先跳转'step-2-0-1'选择Rod or Track，现在逻辑选择ripple-fold变更为直接跳转到 (step-2-0-1选择Track的下一步) 即：step-2-2-3
     */
    const hardware = selectedOptions['step-2-0-1'] || 'hardware-Track'
    let w: any = 0,
      h: any = 0

    if (hardware === 'hardware-Track') {
      const _w = inputValues['hardware-track-length-1'] || 0
      w = isSplitPanels ? _w / 2 : _w
      const ceilingToFloorHeight = inputValues['track-ceiling-to-floor-height'] || 0
      const ringCeilingToBottomHeight = inputValues['track-ring-ceiling-to-bottom-height'] || 0

      /* 2025/11/12 新增逻辑：用户选择pleat/ripple-fold -> track时，如果选择的是MyTrack，需要默认加上1/4 */
      // const isMyTrack = selectorTabKey === TRACK_SELECTOR_TYPE.MT

      /* 分别判断string（分数和带分数）和number类型 */
      if (typeof ringCeilingToBottomHeight === 'string') {
        mixNumberOrFractionHandle(ringCeilingToBottomHeight, ({ type, decimalValue, denominator }) => {
          if (type === 'mixnumber' || type === 'fraction') {
            // 如果是合规的带分数或分数，h = ceilingToFloorHeight - ringCeilingToBottomHeight 这个带分数，并将结果转成带分数，isMyTrack需要加上1/4
            let result = Number(ceilingToFloorHeight) - decimalValue
            result = calculateByCurtainStyle(result) // 根据窗帘长度样式调整最终高度
            // #region 新逻辑，将result(type:小数)按自定义四舍五入，保证最终结果为整数或者代1/2分数
            h = convertToDecimal(result, false)
            // #endregion

            // #region 旧逻辑，将result(type:小数)拆分成带分数，分数部分加1/4，再计算最终结果
            // let { wholePart, fracPart } = convertToMixedNumber(result, denominator) // 拆分成整数部分和带分数分数
            // if (isMyTrack) fracPart = fractionOperation('1/4', fracPart, '+') // 默认加上1/4
            // 分数为1/1时，整数部分加1，分数部分不要了
            // h = fracPart == '1/1' ? `${(Number(wholePart) + 1).toString()}` : `${wholePart} ${fracPart}`
            // #endregion
          } else {
            // 如果不是合规的带分数或分数 h = ceilingToFloorHeight - 0
            h = calculateByCurtainStyle(Number(ceilingToFloorHeight))
          }
        })
      }
      // 如果是数字，该值已在handleContinue出正常转换，正常计算
      else if (typeof ringCeilingToBottomHeight === 'number') {
        // 高度等于轨道天花板到地板的距离减去天花板到轨道环的高度
        let result = Number(ceilingToFloorHeight) - ringCeilingToBottomHeight
        h = calculateByCurtainStyle(result) // 根据窗帘长度样式调整最终高度
      }
    }

    if (hardware === 'hardware-Rod') {
      const windowWidth = inputValues['norod-window-width'] || 0 // 窗户宽度
      const extLeftWidth = inputValues['norod-width-left-extension'] || 0 // 左延申宽度
      const extRightWidth = inputValues['norod-width-right-extension'] || 0 // 右延申宽度
      const windowHeight = inputValues['top-to-floor-height'] || 0 // 地面到窗户高度
      const aboveFrameHeight = inputValues['rod-extension-above-frame'] || 0 // 窗户顶部到天花板高度
      w = windowWidth + extLeftWidth + extRightWidth

      // 如果是 ripple-fold流程，窗户顶部到天花板高度需要固定减去5/8
      if (headerStyle === 'ripple-fold') {
        // #region 新逻辑，加5/8变成减去0.625，再自定义四舍五入，保证最后结果为整数或带1/2的带分数
        const result = calculateByCurtainStyle(windowHeight + aboveFrameHeight - 0.625)
        h = convertToDecimal(result, false)
        // #endregion

        // #region 旧逻辑，高度需要减去5/8，并将结果转成以8为同分母的带分数
        // mixNumberOrFractionHandle(`5/8`, ({ decimalValue, denominator }) => {
        //   const result = calculateByCurtainStyle(windowHeight + aboveFrameHeight - decimalValue)
        //   const { wholePart, fracPart } = convertToMixedNumber(result, denominator) // 转成带分数
        //   h = `${wholePart} ${fracPart}`
        // })
        // #endregion
      }
      // 根据窗帘长度样式调整最终高度
      else {
        h = calculateByCurtainStyle(windowHeight + aboveFrameHeight)
      }
    }

    return [w, h]
  }

  // 计算Pleated的结果
  const calculatePleatedSize = (): [number, number] => {
    let w: any = 0,
      h: any = 0

    // 如果选择的是Pleated->No
    if (selectedOptions['step-2-0-0'] === 'rod-or-track-installed-no') {
      // 前面的流程和Ripple Fold 的流程和计算逻辑一样
      const [_w, _h] = calculateRippleFoldSize()

      // RippleFold默认没有选择Panels这一步。Pleated有这一步，需要单独处理
      w = _w

      // 如果选择的是Rod，高度固定减1 即流程Pleated->No->Rod
      h = selectedOptions['step-2-0-1'] === 'hardware-Rod' ? _h - 1 : _h
    }

    // 如果选择的是Pleated->Yes
    else if (selectedOptions['step-2-0-0'] === 'rod-or-track-installed-yes') {
      const hardware = selectedOptions['step-2-0-2']

      // Pleated->Yes->Track
      if (hardware === 'hardware-Track-2') {
        const _w = inputValues['hardware-track-length-2'] || 0
        let _h = inputValues['track-ring-bottom-to-floor-height'] || 0

        w = isSplitPanels ? _w / 2 : _w

        // Pleated->Yes->Track
        // #region 新逻辑：将_h(type:小数)自定义四舍五入，保证最终结果为整数或带1/2的带分数
        _h = calculateByCurtainStyle(Number(_h))
        h = convertToDecimal(_h, false)
        //#endregion

        // #region 旧逻辑，将_h(type:小数)的高度固定加上1/4，拆分成整数和小数部分返回
        // mixNumberOrFractionHandle('1/4', ({ decimalValue, denominator }) => {
        //   _h = Number(_h) + decimalValue
        //   _h = calculateByCurtainStyle(_h) // 根据窗帘长度样式调整最终高度
        //   const { wholePart, fracPart } = convertToMixedNumber(_h, denominator) // 转成带分数
        //   h = `${wholePart} ${fracPart}`
        // })
        // #endregion
      }

      // Pleated->Yes->Rod
      if (hardware === 'hardware-Rod-2') {
        const _w = inputValues['rod-width-top'] || 0
        let _h = inputValues['rod-top-to-floor-height'] || 0
        w = isSplitPanels ? _w / 2 : _w
        // Pleated->Yes->Track
        // #region 新逻辑：将_h(type:小数)自定义四舍五入，保证最终结果为整数或带1/2的带分数
        _h = calculateByCurtainStyle(Number(_h))
        h = convertToDecimal(_h, false)
        // #endregion

        // #region 旧逻辑，将_h(type:小数)的高度固定加上1/4，拆分成整数和小数部分返回
        // mixNumberOrFractionHandle('1/4', ({ decimalValue, denominator }) => {
        //   _h = Number(_h) + decimalValue
        //   _h = calculateByCurtainStyle(_h) // 根据窗帘长度样式调整最终高度
        //   const { wholePart, fracPart } = convertToMixedNumber(_h, denominator) // 转成带分数
        //   h = `${wholePart} ${fracPart}`
        // })
        // #endregion
      }
    }

    return [w, h]
  }

  // 获取安装类型描述
  const getMountTypeDescription = (): string => {
    const hasRodInstalled = selectedOptions['step-2-0'] === 'rod-installed-yes'
    return hasRodInstalled ? 'Rod Installed' : 'Rod Not Installed'
  }

  // 获取长度样式描述
  const getLengthStyleDescription = (): string => {
    const lengthStyle = selectedOptions['step-3-1-3']

    if (lengthStyle === 'length-style-above-floor') {
      return '1" Above Floor'
    }
    if (lengthStyle === 'length-style-breaks-on-floor') {
      return 'Break On The Floor'
    }
    if (lengthStyle === 'length-style-puddles-on-floor') {
      return 'Slight Puddle On Floor'
    }

    return 'Standard Length'
  }

  // 获取环眼距描述
  const getRingEyeletToFloor = (): string => {
    const ringEyeletToFloor = selectedOptions['step-3-1-5'] || '-'
    return ringEyeletToFloor
  }

  // 获取帘头样式描述
  const getHeaderStyleDescription = (): string => {
    if (headerStyle === 'soft-top') {
      return 'Soft Top'
    }
    if (headerStyle === 'pleated') {
      return 'Pleated'
    }
    if (headerStyle === 'grommets') {
      return 'Grommet'
    }
    if (headerStyle === 'ripple-fold') {
      return 'Ripple Fold'
    }

    return 'Standard'
  }

  // Ripple Fold流程下最后一步获取Fullness
  const getHardware = () => {
    // 默认返回Rod
    if (['soft-top', 'grommets'].includes(headerStyle)) {
      return 'Rod'
    }

    let hardware = selectedOptions['step-2-0-1'] // ripple-fold

    // pleated
    if (headerStyle === 'pleated') {
      // PS. 这里联合step-2-0-1，是因为Pleated的No分支复用的Ripplefold的逻辑，所以联合取该step
      hardware = selectedOptions['step-2-0-2'] || selectedOptions['step-2-0-1']
    }

    if (!hardware) return 'Standard'

    return hardware.split('-')?.[1] || ''
  }

  const renderHardware = () => {
    if ('track-ring-ceiling-to-bottom-height' in inputValues) {
      const v = inputValues['track-ring-ceiling-to-bottom-height']
      const target = (CozyologyConfig?.trackSelectorOptions?.[headerStyle] || []).find(
        item => item.value === v.toString()
      )
      if (target) {
        return (
          <a href={target.link} target="_blank">
            {target.label}
          </a>
        )
      }
    }
    return getHardware()
  }

  // 获取面板类型描述
  const getPanelTypeDescription = (): string => {
    const panelType = selectedOptions['step-4-1']
    if (!panelType) return 'Standard'

    const isRippleFold = selectedOptions?.['step-1'] === 'ripple-fold'

    if (panelType === 'single-panels') {
      // return isRippleFold ? 'Single' : 'Single (Order Qty: 1)'
      return isRippleFold ? 'Single' : 'Single'
    }
    if (panelType === 'split-panels') {
      // return isRippleFold ? 'Split' : 'Split (Order Qty: 2)'
      return isRippleFold ? 'Split' : 'Split'
    }

    return 'Standard'
  }
  // 获取面板类型描述
  const getQuantity = (): string => {
    const panelType = selectedOptions['step-4-1']
    if (!panelType) return 'Standard'

    if (panelType === 'single-panels') {
      return '1 panel'
    }
    if (panelType === 'split-panels') {
      return '2 panel'
    }
    return 'Standard'
  }

  // 根据step-1选择的类型获取相应的additionalInfo
  const getAdditionalInfoForCurrentStep = (): string | undefined => {
    // != 仅判断null和undefined
    if (currentStepData.additionalInfo != undefined) {
      if (currentStep === 'step-3-2-2' && headerStyle === 'ripple-fold') return
      return currentStepData.additionalInfo
    }

    // 只有在step-3-2-2 步骤时才显示additionalInfo
    // if (currentStep !== 'step-3-1-1' && currentStep !== 'step-3-1-2' && currentStep !== 'step-3-2-2') return undefined
    if (currentStep !== 'step-3-2-2') return undefined

    // 只有在输入步骤时才显示additionalInfo
    if (currentStepData.type !== 'input') return undefined

    // 从step-1配置中找到对应选项的additionalInfo
    const step1Config = CozyologyConfig.measurementConfig['step-1']
    const selectedOption = step1Config?.options?.find(option => option.id === headerStyle)

    return selectedOption?.additionalInfo || currentStepData.additionalInfo
  }

  const handleContinue = (jump: string, optionId?: string) => {
    // 如果当前步骤是选择类型，记录选择的选项ID
    if (currentStepData.type === 'select' && optionId) {
      setSelectedOptions(prev => ({
        ...prev,
        [currentStep]: optionId,
      }))
    }

    // 如果当前步骤是输入类型，验证所有输入是否都已填写
    if (currentStepData.type === 'input') {
      const validation = validateCurrentStepInputs()
      if (!validation.isValid) {
        // 构建简化的错误提示
        const errorMessages = currentStepData.options
          .map(option => {
            const value = currentStepInputs[option.id]
            const fieldName = option.title || option.label || option.id
            const showFieldName = currentStepData.options.length > 1

            if (!value || value.trim() === '' || isNaN(parseFloat(value))) {
              if (option.max) {
                return showFieldName
                  ? `${fieldName}: Please enter a number between ${option.min} and ${option.max}`
                  : `Please enter a number between ${option.min} and ${option.max}`
              } else {
                return showFieldName
                  ? `${fieldName}: Please enter a number between ${option.min} and above`
                  : `Please enter a number between ${option.min} and above`
              }
            }

            const numValue = parseFloat(value)
            if (numValue < option.min || (option.max && numValue > option.max)) {
              if (option.max) {
                return showFieldName
                  ? `${fieldName}: Please enter a number between ${option.min} and ${option.max}`
                  : `Please enter a number between ${option.min} and ${option.max}`
              } else {
                return showFieldName
                  ? `${fieldName}: Please enter a number between ${option.min} and above`
                  : `Please enter a number between ${option.min} and above`
              }
            }

            return null
          })
          .filter(msg => msg !== null)

        if (errorMessages.length > 0) {
          alert(errorMessages.join('\n\n'))
          return // 如果验证失败，不继续
        }
      }

      // 保存当前步骤的输入值
      saveCurrentStepInputs()
    }

    // 动态调整跳转目标
    let actualJump = jump

    // 如果即将到 step-4-1 阶段，因为第一步固定 step-1，并判断第一步是否选择的是ripple-fold，这是新流程Ripple Fold track分支
    // 该分支结尾不需要选择一片or两片（step-4-1），直接跳转最后结算阶段（step-4-2）
    // if (stepHistory.length > 1 && actualJump === 'step-4-1' && headerStyle === 'ripple-fold') {
    //   actualJump = 'step-4-2'
    // }

    // 如果当前步骤是 step-1 且历史记录中有超过一个步骤，说明用户重新选择了第一步
    // 需要清空之前的历史和已完成步骤，重新开始
    if (currentStep === 'step-1' && stepHistory.length > 1) {
      // 保留step-1的选择
      const newSelectedOptions = optionId ? { 'step-1': optionId } : {}
      setCompletedSteps([currentStep])
      setStepHistory(['step-1', actualJump])
      setInputValues({}) // 清空所有之前的输入值
      setSelectedOptions(newSelectedOptions) // 保留当前步骤的选择
    } else {
      // 记录当前步骤为已完成
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep])
      }

      // 添加到历史记录
      setStepHistory(prev => [...prev, actualJump])
    }

    // 清空当前步骤输入和错误信息
    setCurrentStepInputs({})
    setInputErrors({})

    setCurrentStep(actualJump)

    // 如果跳转到输入步骤，恢复之前保存的输入值
    restoreInputsForStep(actualJump)

    // 移动端点击 CONTINUE 后滚动到顶部
    if (window.innerWidth < 768 && stepWrapRef.current) {
      const elementRect = stepWrapRef.current.getBoundingClientRect()
      const targetPosition = window.pageYOffset + elementRect.top - 90
      window.scrollTo({ top: targetPosition, behavior: 'smooth' })
    }
  }

  const handleCalculateAgain = () => {
    setCurrentStep('step-1')
    setCompletedSteps([])
    setStepHistory(['step-1']) // 重置历史记录
    setInputValues({}) // 重置所有输入值
    setCurrentStepInputs({}) // 重置当前步骤输入
    setInputErrors({}) // 重置错误信息
    setSelectedOptions({}) // 重置选择的选项
  }

  const handleShopNow = () => {
    window.open(CozyologyConfig.shopNowUrl, '_blank')
  }

  const currentStepData = CozyologyConfig.measurementConfig[currentStep]

  const stepWrapRef = useRef<HTMLDivElement>(null)

  // 获取结果fullness
  const getFullness = (): string => {
    if (headerStyle === 'soft-top') {
      return '3x'
    }

    // ripple-fold & pleated & grommets
    return '2.2x'
  }

  const renderSelectedInfos = () => {
    const list: { key: string; value: string }[] = []

    if (headerStyle === 'pleated') {
      if (selectedOptions['step-2-0-0'] === 'rod-or-track-installed-yes') {
        // pleated yes Rod
        if (selectedOptions['step-2-0-2'] === 'hardware-Rod-2') {
          list.push(
            { key: 'Hardware', value: 'Installed Rod' },
            { key: 'Rod Length', value: `${inputValues['rod-width-top']}"` },
            { key: 'Ring Eyelet to Floor', value: `${inputValues['rod-top-to-floor-height']}"` }
          )
        }
        // pleated yes Track
        else if (selectedOptions['step-2-0-2'] === 'hardware-Track-2') {
          list.push(
            { key: 'Hardware', value: 'Installed Track' },
            { key: 'Track Length', value: `${inputValues['hardware-track-length-1']}"` },
            { key: 'Bottom of Track Gilder to Floor', value: `${inputValues['track-ring-bottom-to-floor-height']}"` }
          )
        }
      } else if (selectedOptions['step-2-0-0'] === 'rod-or-track-installed-no') {
        // pleated no Rod
        if (selectedOptions['step-2-0-1'] === 'hardware-Rod') {
          list.push(
            { key: 'Hardware', value: 'No Rod Installed' },
            { key: 'Window Width', value: `${inputValues['norod-window-width']}"` },
            { key: 'Left Side Width', value: `${inputValues['norod-width-left-extension']}"` },
            { key: 'Right Side Width', value: `${inputValues['norod-width-right-extension']}"` },
            { key: 'Window Top to Floor Height', value: `${inputValues['top-to-floor-height']}"` },
            { key: 'Rod Extension Above Frame', value: `${inputValues['rod-extension-above-frame']}"` }
          )
        }
        // pleated no Track
        else if (selectedOptions['step-2-0-1'] === 'hardware-Track') {
          list.push(
            { key: 'Hardware', value: 'No Track Installed' },
            { key: 'Track Length', value: `${inputValues['hardware-track-length-1']}"` },
            { key: 'Height from Ceiling to Floor', value: `${inputValues['track-ceiling-to-floor-height']}"` }
          )
        }
      }
    } else if (headerStyle === 'ripple-fold') {
      list.push(
        { key: 'Track Length', value: `${inputValues['hardware-track-length-1']}"` },
        { key: 'Ceiling to Floor', value: `${inputValues['track-ceiling-to-floor-height']}"` }
      )
      if (selectorTabKey === 'My Track') {
        list.push({
          key: 'Ceiling to Bottom of Track Gilder',
          value: `${inputValues['track-ring-ceiling-to-bottom-height']}"`,
        })
      }
    } else if (['soft-top', 'grommets'].includes(headerStyle)) {
      if (selectedOptions['step-2-0'] === 'rod-installed-yes') {
        list.push(
          { key: 'Hardware', value: 'Installed Rod' },
          { key: 'Rod Length', value: `${inputValues['rod-width-top']}"` },
          { key: 'Ring Eyelet to Floor', value: `${inputValues['rod-top-to-floor-height']}"` }
        )
      } else if (selectedOptions['step-2-0'] === 'rod-installed-no') {
        list.push(
          { key: 'Hardware', value: 'No Rod Installed' },
          { key: 'Window Width', value: `${inputValues['norod-window-width']}"` },
          { key: 'Left Side Width', value: `${inputValues['norod-width-left-extension']}"` },
          { key: 'Right Side Width', value: `${inputValues['norod-width-right-extension']}"` },
          { key: 'Window Top to Floor Height', value: `${inputValues['top-to-floor-height']}"` },
          { key: 'Rod Extension Above Frame', value: `${inputValues['rod-extension-above-frame']}"` }
        )
      }
    }

    return (
      <SelectedInfos
        list={list}
      >
        <>
          <div className="flex mb-[10px] justify-between items-center">
            <div className="flex-1 text-[#999999]">Length Style: </div>
            <div className="flex-1">{getLengthStyleDescription?.()}</div>
          </div>
          <div className="flex mb-[10px] justify-between items-center">
            <div className="flex-1 text-[#999999]">Panel: </div>
            <div className="flex-1">{getPanelTypeDescription?.()}</div>
          </div>
        </>
      </SelectedInfos>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row" ref={stepWrapRef}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[30%] bg-white">
        <div className="flex flex-col h-full">
          <div className="mt-[80px]">
            {steps.map((step, index) => (
              <div key={step.id} className="flex">
                <div className="flex flex-col items-center mr-4 w-[30px]">
                  <div
                    className={`w-4 h-4 rounded-full border-solid transition-colors ${
                      step.active
                        ? 'w-7.5 h-7.5 bg-black border-[#BBB3AB] border-8 cursor-pointer'
                        : step.completed
                          ? 'w-4 h-4 bg-black cursor-pointer'
                          : 'bg-white border-2 border-black cursor-not-allowed'
                    }`}
                    onClick={() => handleStepNavigation(step.id)}
                  />
                  {index < steps.length - 1 && <div className="w-0.5 h-15 bg-black" />}
                </div>
                <div
                  className={`flex-1 transition-colors ${
                    step.active
                      ? 'text-black font-medium text-[20px] leading-[30px] cursor-pointer'
                      : step.completed
                        ? 'text-black text-[16px] leading-none cursor-pointer'
                        : 'text-[#ccc] text-[16px] leading-none cursor-not-allowed'
                  }`}
                  onClick={() => handleStepNavigation(step.id)}
                >
                  Step {step.stepNumber} - {step.title}
                </div>
              </div>
            ))}
          </div>

          {/* QR Code Section */}
          <div className="mt-30">
            <div className="flex items-center gap-[20px]">
              <div className="w-[130px] h-[130px] rounded flex-shrink-0">
                <div className="qr-code-image image-qr-code" />
              </div>
              <div
                className="text-[14px]"
                dangerouslySetInnerHTML={{
                  __html: CozyologyConfig.contactDetails,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Step Indicator */}
      <div className="lg:hidden bg-[#F3F3F3] px-8 py-5 md:mb-4 overflow-auto">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center relative ${
                step.completed || step.active ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              onClick={() => handleStepNavigation(step.id)}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full border-solid transition-colors border-[#BBB3AB] relative z-1 ${
                  step.active
                    ? 'w-4 h-4 bg-black border-4'
                    : step.completed
                      ? 'w-2.5 h-2.5 bg-black border-1 my-[3px]'
                      : 'bg-white border-1 my-[3px]'
                }`}
              />
              <div
                className={`text-xs mt-1 transition-colors ${
                  step.active ? 'text-black font-medium mt-1' : step.completed ? 'text-black' : 'text-[#999999]'
                }`}
              >
                Step {step.stepNumber}
              </div>
              {index < steps.length - 1 && (
                <div className="absolute top-2 left-1/2 w-[calc(100vw/4)] h-0.5 bg-[#DDDDDD] z-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="md:mx-auto md:py-0 mx-4 pt-5 relative">
          {currentStepData && (
            <>
              <div className="h-[24px] mb-2">
                {getPreviousStep() && (
                  <button
                    onClick={() => {
                      const prevStep = getPreviousStep()!
                      setCurrentStep(prevStep)
                      restoreInputsForStep(prevStep)
                    }}
                    className="flex items-center gap-2 cursor-pointer not-md:text-[14px] not-md:text-gray-900"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10 12L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Previous
                  </button>
                )}
              </div>
              <div className="text-center mb-7 text-gray-900 not-md:mb-6">
                {currentStepData.title && (
                  <h1 className="text-[30px] font-americana_bt not-md:text-[18px] lg:min-h-[45px]">
                    {currentStepData.title}
                  </h1>
                )}
                {currentStepData.subTitle && (
                  <div className="text-[16px] not-md:text-[12px] text-[#333]">{currentStepData.subTitle}</div>
                )}
              </div>
              {currentStepData.type === 'select' && (
                <div className="flex flex-col md:flex-row gap-6 justify-around items-stretch">
                  {currentStepData.options.map(option => (
                    <div
                      key={option.id}
                      className="group max-w-[400px] md:min-h-[400px] transition-all duration-200 hover:bg-[#F5F5F5] flex flex-col relative cursor-pointer not-md:bg-[#F5F5F5] not-md:w-full not-md:h-auto md:flex-1"
                      onClick={() => handleContinue(option.jump, option.id)}
                    >
                      <div className="p-[20px] pb-[70px] flex-1 flex flex-col gap-5 not-md:gap-[14px] not-md:flex-row not-md:p-4">
                        <div className="w-full aspect-square mx-auto relative not-md:w-[50%]">
                          <div className={`option-image ${option.imageClass}`} />
                        </div>
                        <div className="flex-1 md:text-center flex flex-col justify-between">
                          <div>
                            <h3 className="text-[24px] text-[#171717] not-md:text-[15px] flex items-center">
                              <div className="flex-1">{option.title}</div>
                            </h3>
                            <div className="h-[1px] bg-[#DDDDDD] my-4 not-md:my-[10px]"></div>
                            <div
                              className={`text-[16px] text-[#171717] not-md:text-[12px]`}
                              dangerouslySetInnerHTML={{ __html: option.description }}
                            />
                          </div>
                          {option.detailUrl && (
                            <div className="hidden not-md:block">
                              <a
                                href={option.detailUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8b572a] text-[16px] not-md:text-[12px] block font-americana_bt"
                                onClick={e => e.stopPropagation()}
                              >
                                Details →
                              </a>
                            </div>
                          )}
                          {option.featureLink && (
                            <a
                              className={`text-[16px] text-[#ba6352] not-md:text-[12px] md:text-center underline md:mt-1`}
                              dangerouslySetInnerHTML={{ __html: option.featureLink.content }}
                              rel="noopener noreferrer"
                              target="_blank"
                              href={option.featureLink.link}
                              onClick={e => e.stopPropagation()}
                            />
                          )}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 hidden group-hover:block">
                        <button className="w-full px-12 py-3 text-lg font-medium transition-all duration-200 bg-black text-white cursor-pointer">
                          CONTINUE
                        </button>
                      </div>
                      {option.detailUrl && (
                        <div className="not-md:hidden md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-200 text-center w-full absolute -bottom-7">
                          <a
                            href={option.detailUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8b572a] text-[16px] block"
                            onClick={e => e.stopPropagation()}
                          >
                            Details →
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {currentStepData.type === 'input' && (
                <div className="flex gap-[75px] md:bg-[#F5F5F5] p-[50px] not-md:p-2 not-md:flex-col not-md:items-center not-md:gap-[15px]">
                  <div className="w-[45%] mx-auto relative flex items-stretch gap-[10px] not-md:w-full not-md:bg-[#F5F5F5] not-md:p-2">
                    <div className="w-full not-md:w-[50%]">
                      <div className={`step-image ${currentStepData.imageClass}`} />
                    </div>
                    <div className="md:hidden not-md:w-[50%] text-[12px] flex flex-col justify-between gap-[10px]">
                      {currentStep === 'step-3-2-2' ? (
                        /* step-3-2-2是pleated和ripple-fold都会经过的一个步骤，即headerStyle只会等于pleated或ripple */
                        <div
                          className="whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: currentStepData.description?.[headerStyle] || '' }}
                        ></div>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: currentStepData.description }}></div>
                      )}
                      {getAdditionalInfoForCurrentStep() && (
                        <div className="relative">
                          <button
                            onClick={() => setShowTooltip(!showTooltip)}
                            className="w-5 h-5 image-question cursor-pointer"
                            type="button"
                          ></button>
                          {showTooltip && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowTooltip(false)} />
                              <div className="absolute bottom-8 left-[-118px] z-20 w-[256px] p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-left">
                                <div
                                  className="text-sm text-gray-700"
                                  dangerouslySetInnerHTML={{ __html: getAdditionalInfoForCurrentStep() }}
                                ></div>
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-gray-200 rotate-45" />
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-[10px] not-md:w-full">
                    <div className="flex-1 not-md:hidden text-[16px] flex flex-col justify-between gap-[10px]">
                      {currentStep === 'step-3-2-2' ? (
                        /* step-3-2-2是pleated和ripple-fold都会经过的一个步骤，即headerStyle只会等于pleated或ripple */
                        <div
                          className="whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: currentStepData.description?.[headerStyle] || '' }}
                        ></div>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: currentStepData.description }}></div>
                      )}
                      {getAdditionalInfoForCurrentStep() && (
                        <div className="relative">
                          <button
                            onClick={() => setShowTooltip(!showTooltip)}
                            className="w-5 h-5 image-question cursor-pointer"
                            type="button"
                          ></button>
                          {showTooltip && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowTooltip(false)} />
                              <div className="absolute bottom-8 left-[-118px] z-20 w-[256px] p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-left">
                                <div
                                  className="text-sm text-gray-700"
                                  dangerouslySetInnerHTML={{ __html: getAdditionalInfoForCurrentStep() }}
                                ></div>
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-gray-200 rotate-45" />
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-end gap-[20px] not-md:gap-[15px]">
                      {currentStepData.options.map(option => (
                        <div className="flex not-md:flex-col" key={option.id}>
                          {currentStepData.options.length > 1 && (
                            <div className="w-[80px] not-md:flex gap-2">
                              <div className="text-[18px] not-md:text-[12px]">{option.title}</div>
                              <div className="text-[12px] not-md:text-[12px]">{option.label}</div>
                            </div>
                          )}
                          {option.isTrackSelector ? (
                            <div className="flex-1">
                              <TrackSelector
                                key={option.id}
                                value={currentStepInputs[option.id] || ''}
                                headerStyle={headerStyle}
                                initialTabKey={selectorTabKey}
                                handleInputChange={value => handleInputChange(option.id, value)}
                                handleSelectChange={value => handleInputChange(option.id, value)}
                                handleTabSwitch={value => handleTabSwitch(option, value)}
                              />
                            </div>
                          ) : (
                            <div className="flex-1">
                              <div className={`flex items-center gap-2 border h-[42px] bg-white`}>
                                <input
                                  className="w-full h-[40px] px-4 focus:outline-none focus:border-black text-[16px] not-md:text-[14px]"
                                  placeholder={`${option.min}${option.max ? `~${option.max}` : ''}`}
                                  min={option.min}
                                  max={option.max}
                                  value={currentStepInputs[option.id] || ''}
                                  onChange={e => handleInputChange(option.id, e.target.value)}
                                  required
                                />
                                <div className="h-[25px] leading-[25px] px-[20px] border-l text-[12px]">Inches</div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="">
                        <button
                          onClick={() => handleContinue(currentStepData.jump)}
                          className="w-full h-[40px] text-lg not-md:text-[12px] font-medium transition-all duration-200 cursor-pointer bg-black text-white"
                        >
                          CONTINUE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStepData.type === 'finished' && (
                <>
                  <div className="md:flex">
                    <div className="flex flex-col items-center bg-[#F5F5F5] py-[70px] not-md:py-[25px] xl:px-[60px]">
                      <div className="flex flex-col items-center px-[30px]">
                        <div className="text-[20px] text-black not-md:text-[12px]">
                          {headerStyle === 'ripple-fold'
                            ? CozyologyConfig.resultTexts?.finishedTitleOfRippleFold
                            : CozyologyConfig.resultTexts?.finishedTitle}
                        </div>
                        <div className="md:hidden w-full h-[1px] bg-[#DDD] my-[15px]"></div>
                        <div className="text-black mt-[30px] not-md:my-[0] not-md:text-[35px] font-americana_bt">
                          {(() => {
                            const { width, height } = calculateRecommendedSize()
                            return (
                              <>
                                {/* web */}
                                <div className="not-md:hidden text-6xl">
                                  {width}" W * {height}" L
                                </div>
                                {/* mobile */}
                                <div className="text-center md:hidden">
                                  <div>{width}" W</div>
                                  <div className="text-lg text-[#999999] leading-1">×</div>
                                  <div>{height}" L</div>
                                </div>
                              </>
                            )
                          })()}
                        </div>
                        <div className="md:hidden text-[#999999] text-center">
                          <div className="text-[12px] font-americana_bt font-bold">
                            Header: {getHeaderStyleDescription()}
                          </div>
                          {showExtraResultInfos && (
                            <>
                              <div className="text-[12px]   font-bold ">Fullness: {getFullness()}</div>
                              <div className="text-[12px]   font-bold ">Hardware: {renderHardware()}</div>
                            </>
                          )}
                          <div className="text-[12px] font-americana_bt font-bold ">
                            Bottom: {getLengthStyleDescription()}
                          </div>
                          <div className="text-[12px] font-americana_bt font-bold">
                            Panel: {getPanelTypeDescription()}
                          </div>
                        </div>
                        <div className="md:hidden w-full h-[1px] bg-[#DDD] my-[15px] mb-0"></div>
                        <div className="mt-[20px] text-[16px] text-center text-[#999999] not-md:text-[12px]">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: CozyologyConfig.resultTexts?.orderInstructions || '',
                            }}
                          />
                        </div>
                      </div>

                      <table className="border border-gray-400 border-collapse text-sm not-md:hidden">
                        <tbody>
                          <tr>
                            <td className="border border-gray-400 p-2 w-[270px]">
                              Header: <span className="font-bold">{getHeaderStyleDescription()}</span>
                            </td>
                            <td className="border border-gray-400 p-2 w-[270px]">
                              Fullness: <span className="font-bold">{getFullness()}</span>
                            </td>
                            {/* <td className="border border-gray-400 p-2 w-[270px]" rowSpan={2}>
                            Hardware: <span className="font-bold">{renderHardware()}</span>
                          </td> */}
                          </tr>
                          <tr>
                            <td className="border border-gray-400 p-2 w-[270px]">
                              Quantity: <span className="font-bold">{getQuantity()}</span>
                              {/* Bottom: <span className="font-bold">{getLengthStyleDescription()}</span> */}
                            </td>
                            <td className="border border-gray-400 p-2 w-[270px]">
                              Hardware: <span className="font-bold">{renderHardware()}</span>
                              {/* Panel: <span className="font-bold">{getPanelTypeDescription()}</span> */}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="not-md:hidden mt-[50px] flex gap-[30px] w-full px-[30px]">
                        <button
                          onClick={handleShopNow}
                          className="flex-1 h-[60px] text-lg font-medium transition-all duration-200 bg-black text-white cursor-pointer"
                        >
                          SHOP NOW
                        </button>
                        <button
                          onClick={handleCalculateAgain}
                          className="flex-1 h-[60px] text-lg font-medium transition-all duration-200 border cursor-pointer"
                        >
                          CALCULATE AGAIN
                        </button>
                      </div>

                      <div className="mt-[50px] text-[16px] text-center text-[#999999] not-md:text-[12px] not-md:mt-[0]">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: CozyologyConfig.resultTexts?.screenshotReminder || '',
                          }}
                        />
                      </div>
                    </div>

                    <div className="md:hidden mt-[20px] flex gap-[15px]">
                      <button
                        onClick={handleShopNow}
                        className="flex-1 h-[40px] text-[12px] font-medium transition-all duration-200 bg-black text-white cursor-pointer"
                      >
                        SHOP NOW
                      </button>
                      <button
                        onClick={handleCalculateAgain}
                        className="flex-1 h-[40px] text-[12px] font-medium transition-all duration-200 border cursor-pointer"
                      >
                        CALCULATE AGAIN
                      </button>
                    </div>

                    {/* 右边 You've selected*/}
                    {renderSelectedInfos()}
                  </div>
                </>
              )}
            </>
          )}

          {/* Mobile QR Code Section */}
          <div className="lg:hidden mt-8 p-4 bg-[#F6F2EF] rounded-lg not-md:mb-[20px]">
            <div className="flex items-center justify-between">
              <div
                className="flex-1 text-[12px]"
                dangerouslySetInnerHTML={{
                  __html: CozyologyConfig.contactDetailsMobile,
                }}
              ></div>
              <div className="w-[65px] h-[65px] flex-shrink-0">
                <div className="qr-code-image image-qr-code" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
