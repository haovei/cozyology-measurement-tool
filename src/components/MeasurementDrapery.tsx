'use client'

import { useRef, useState } from 'react'

const CozyologyConfig = window.CozyologyConfig_Drapery

export default function MeasurementTool() {
  const [currentStep, setCurrentStep] = useState('step-1')
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [stepHistory, setStepHistory] = useState<string[]>(['step-1']) // 记录步骤历史
  const [inputValues, setInputValues] = useState<Record<string, number>>({}) // 记录所有输入值
  const [currentStepInputs, setCurrentStepInputs] = useState<Record<string, string>>({}) // 当前步骤的输入值
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({}) // 输入错误信息
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({}) // 记录每个步骤选择的选项ID
  const [showTooltip, setShowTooltip] = useState(false) // 控制工具提示显示

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
        const step2Options = ['step-2-0', 'step-2-1-1', 'step-2-2-1', 'step-2-2-2']
        const completedStep2 = step2Options.filter(step => completedSteps.includes(step))
        return completedStep2.length > 0 ? completedStep2[completedStep2.length - 1] : 'step-2-0'
      case 'step-3':
        // 返回已完成的最后一个step-3子步骤，或根据Rod Installed状态确定第一个step-3步骤
        const step3Options = ['step-3-1-1', 'step-3-2-1', 'step-3-1-2', 'step-3-1-3']
        const completedStep3 = step3Options.filter(step => completedSteps.includes(step))
        if (completedStep3.length > 0) {
          return completedStep3[completedStep3.length - 1]
        }
        // 根据Rod Installed状态决定起始步骤
        const hasRodInstalled = selectedOptions['step-2-0'] === 'rod-installed-yes'
        return hasRodInstalled ? 'step-3-1-1' : 'step-3-2-1'
      case 'step-4':
        // 返回已完成的最后一个step-4子步骤，或第一个step-4步骤
        const step4Options = ['step-4-1', 'step-4-2']
        const completedStep4 = step4Options.filter(step => completedSteps.includes(step))
        return completedStep4.length > 0 ? completedStep4[completedStep4.length - 1] : 'step-4-1'
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
        newInputs[option.id] = parseFloat(value)
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
  const convertToDecimal = (decimal: number): string => {
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
    } else if (fractionalPart >= 0.1 && fractionalPart <= 0.3) {
      // 0.1-0.3 之间的值，四舍五入到0
      adjustedFractionalPart = 0.0
    } else if (fractionalPart > 0.3 && fractionalPart <= 0.7) {
      // 0.3-0.7 之间的值，四舍五入到0.5
      adjustedFractionalPart = 0.5
    } else {
      // 大于0.7的值，四舍五入到1.0
      adjustedFractionalPart = 1.0
    }

    // 如果调整后的小数部分是1.0，则进位到整数部分
    if (adjustedFractionalPart >= 1.0) {
      return (wholeNumber + 1).toString()
    }

    // 如果调整后的小数部分是0，则只返回整数部分
    if (adjustedFractionalPart === 0) {
      return wholeNumber.toString()
    }

    // 返回小数格式
    return (wholeNumber + adjustedFractionalPart).toString()
  }

  // 计算最终的推荐尺寸
  const calculateRecommendedSize = (): { width: string; height: string } => {
    // 判断是否已安装窗帘杆
    const hasRodInstalled = selectedOptions['step-2-0'] === 'rod-installed-yes'
    console.log('计算推荐尺寸 - hasRodInstalled:', hasRodInstalled)
    console.log('计算推荐尺寸 - selectedOptions:', selectedOptions)
    console.log('计算推荐尺寸 - inputValues:', inputValues)

    let width = 0
    let height = 0

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

    // 计算高度 - 第一步：计算杆到地面的距离
    let rodToFloorHeight = 0

    if (hasRodInstalled) {
      // 已安装杆的情况：直接使用杆到地面的高度
      rodToFloorHeight = inputValues['rod-top-to-floor-height'] || 0
      console.log('已安装杆 - rodToFloorHeight:', rodToFloorHeight)
    } else {
      // 未安装杆的情况：窗户顶部到地面的高度 + 杆在窗框上方的延伸
      const windowTopToFloorHeight = inputValues['top-to-floor-height'] || 0
      const rodExtensionAboveFrame = inputValues['rod-extension-above-frame'] || 0
      rodToFloorHeight = windowTopToFloorHeight + rodExtensionAboveFrame
      console.log('未安装杆 - windowTopToFloorHeight:', windowTopToFloorHeight)
      console.log('未安装杆 - rodExtensionAboveFrame:', rodExtensionAboveFrame)
      console.log('未安装杆 - rodToFloorHeight:', rodToFloorHeight)
    }

    // 计算高度 - 第二步：根据帘头样式调整起始高度
    const headerStyle = selectedOptions['step-1']
    console.log('帘头样式 - headerStyle:', headerStyle)
    let curtainHeight = rodToFloorHeight

    if (headerStyle === 'pleated') {
      // 褶皱样式：从杆到地面的距离减去1英寸用于环的半径
      curtainHeight = rodToFloorHeight - 1
      console.log('褶皱样式 - curtainHeight:', curtainHeight)
    } else if (headerStyle === 'soft-top') {
      // 软顶样式：Rod Pocket 需要考虑杆的直径和袋口的额外长度
      curtainHeight = rodToFloorHeight + 0.9
      console.log('软顶样式 - curtainHeight:', curtainHeight)
    } else if (headerStyle === 'grommets') {
      // 扣眼样式：Grommets 安装在窗帘顶部，需要额外长度
      curtainHeight = rodToFloorHeight + 2.8
      console.log('扣眼样式 - curtainHeight:', curtainHeight)
    }

    // 计算高度 - 第三步：根据窗帘长度样式调整最终高度
    const lengthStyle = selectedOptions['step-3-1-3']
    console.log('长度样式 - lengthStyle:', lengthStyle)
    if (lengthStyle === 'length-style-above-floor') {
      // 离地面1英寸
      height = curtainHeight - 1
    } else if (lengthStyle === 'length-style-breaks-on-floor') {
      // 接触地面：使用计算出的高度
      height = curtainHeight
    } else if (lengthStyle === 'length-style-puddles-on-floor') {
      // 轻微堆积在地面：增加1英寸
      height = curtainHeight + 1
    } else {
      // 默认情况
      height = curtainHeight
    }
    console.log('最终高度计算 - height:', height)

    // 根据面板类型调整宽度
    const panelType = selectedOptions['step-4-1']
    if (panelType === 'split-panels') {
      // 分割面板：宽度减半
      width = width / 2
    }

    // 确保宽度和高度都是正数，防止计算错误导致负值
    width = Math.max(width, 0)
    height = Math.max(height, 0)

    return {
      width: convertToDecimal(width),
      height: convertToDecimal(height),
    }
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

  // 获取帘头样式描述
  const getHeaderStyleDescription = (): string => {
    const headerStyle = selectedOptions['step-1']

    if (headerStyle === 'soft-top') {
      return 'Soft Top'
    }
    if (headerStyle === 'pleated') {
      return 'Pleated'
    }
    if (headerStyle === 'grommets') {
      return 'Grommet'
    }

    return 'Standard'
  }

  // 获取面板类型描述
  const getPanelTypeDescription = (): string => {
    const panelType = selectedOptions['step-4-1']

    if (panelType === 'single-panels') {
      return 'Single Panel'
    }
    if (panelType === 'split-panels') {
      return 'Split Panels'
    }

    return 'Standard Panel'
  }

  // 根据step-1选择的类型获取相应的additionalInfo
  const getAdditionalInfoForCurrentStep = (): string | undefined => {
    // 只有在 step-3-1-1 或 step-3-1-2 步骤时才显示additionalInfo
    if (currentStep !== 'step-3-1-1' && currentStep !== 'step-3-1-2') return undefined

    // 只有在输入步骤时才显示additionalInfo
    if (currentStepData.type !== 'input') return undefined

    // 获取step-1选择的header style
    const headerStyle = selectedOptions['step-1']

    if (!headerStyle) return currentStepData.additionalInfo

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
                  <h1 className="text-[30px] font-americana not-md:text-[18px] lg:min-h-[45px]">
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
                        <div className="flex-1 md:text-center">
                          <h3 className="text-[24px] text-[#171717] not-md:text-[15px] flex items-center">
                            <div className={`flex-1 ${currentStep === 'step-1' ? 'md:text-left' : ''}`}>
                              {option.title}
                            </div>
                            {option.detailUrl && (
                              <div className="md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-200">
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
                          </h3>
                          <div className="h-[1px] bg-[#DDDDDD] my-5 not-md:my-[10px]"></div>
                          <div
                            className={`text-[16px] text-[#171717] not-md:text-[12px] ${currentStep === 'step-1' ? 'md:text-left' : ''}`}
                            dangerouslySetInnerHTML={{ __html: option.description }}
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 hidden group-hover:block">
                        <button className="w-full px-12 py-3 text-lg font-medium transition-all duration-200 bg-black text-white cursor-pointer">
                          CONTINUE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentStepData.type === 'input' && (
                <div className="flex gap-[75px] md:bg-[#F5F5F5] p-[50px] not-md:p-2 not-md:flex-col not-md:items-center not-md:gap-[15px]">
                  <div className="w-[45%] mx-auto relative flex items-center gap-[10px] not-md:w-full not-md:bg-[#F5F5F5] not-md:p-2">
                    <div className="w-full not-md:w-[50%]">
                      <div className={`step-image ${currentStepData.imageClass}`} />
                    </div>
                    <div className="md:hidden not-md:w-[50%] text-[12px] flex flex-col justify-between gap-[10px]">
                      <div dangerouslySetInnerHTML={{ __html: currentStepData.description }}></div>
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
                                <div className="text-sm text-gray-700">{getAdditionalInfoForCurrentStep()}</div>
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
                      <div dangerouslySetInnerHTML={{ __html: currentStepData.description }}></div>
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
                                <div className="text-sm text-gray-700">{getAdditionalInfoForCurrentStep()}</div>
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
                            <div className="w-[80px] not-md:flex not-md:font-bold gap-2">
                              <div className="text-[18px] not-md:text-[12px]">{option.title}</div>
                              <div className="text-[12px] not-md:text-[12px]">{option.label}</div>
                            </div>
                          )}
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
                  <div className="flex flex-col items-center bg-[#F5F5F5] py-[70px] not-md:py-[25px] xl:px-[120px]">
                    <div className="flex flex-col items-center px-[30px]">
                      <div className="text-[20px] font-medium text-black not-md:text-[12px]">
                        Your recommended drapery size is&nbsp;
                      </div>
                      <div className="md:hidden w-full h-[1px] bg-[#DDD] my-[15px]"></div>
                      <div className="text-[60px] text-black mt-[30px] not-md:my-[0] not-md:text-[35px] font-americana">
                        {(() => {
                          const { width, height } = calculateRecommendedSize()
                          return `${width}" W × ${height}" L`
                        })()}
                      </div>
                      <div className="md:hidden w-full h-[1px] bg-[#DDD] my-[15px]"></div>
                      <div className="mt-[20px] text-[16px] text-center text-[#999999] not-md:text-[12px]">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: CozyologyConfig.resultTexts?.orderInstructions || '',
                          }}
                        />
                      </div>
                      <div className="mt-[50px] text-[16px] text-center text-[#999999] not-md:text-[12px] not-md:mt-[0]">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: CozyologyConfig.resultTexts?.screenshotReminder || '',
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-[50px] flex w-full text-center">
                      <div className="flex flex-col items-center flex-1 px-4">
                        <div className="text-[16px] text-[#999] font-americana mb-[24px]">Header</div>
                        <div className="text-[16px] font-americana">{getHeaderStyleDescription()}</div>
                      </div>
                      <div className="flex flex-col items-center flex-1 px-4 border-l border-[#DDD]">
                        <div className="text-[16px] text-[#999] font-americana mb-[24px]">Bottom</div>
                        <div className="text-[16px] font-americana ">{getLengthStyleDescription()}</div>
                      </div>
                      <div className="flex flex-col items-center flex-1 px-4 border-l border-[#DDD]">
                        <div className="text-[16px] text-[#999] font-americana mb-[24px]">Panel Type</div>
                        <div className="text-[16px] font-americana">{getPanelTypeDescription()}</div>
                      </div>
                    </div>

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
                </>
              )}
            </>
          )}

          {/* Mobile QR Code Section */}
          <div className="lg:hidden mt-8 p-4 bg-[#F6F2EF] rounded-lg">
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
