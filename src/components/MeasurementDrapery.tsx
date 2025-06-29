'use client'

import { useRef, useState } from 'react'

interface MeasurementToolProps {
  shopNowUrl?: string
}

// const CozyologyConfig = window.CozyologyConfig_Drapery
const CozyologyConfig = {
  stepTitles: {
    'step-1': 'Choose Header Style',
    'step-2': 'Specify the Width',
    'step-3': 'Specify the Height',
    'step-finished': 'Panels',
  },
  resultTexts: {
    orderInstructions:
      "Use the size listed above when placing your order. We've handled all the calculations for you—no need to make any manual adjustments.",
    screenshotReminder:
      'For your records, please <span class="text-[#ba6352]">take a screenshot</span> before proceeding.',
  },
  contactDetails: `<div class="font-bold text-black">Want to double-check your sizing?</div>
                <div class="mt-[10px] text-gray-500">
                  <div>Send us a quick photo via</div>
                  <div>
                    <a
                      href="https://api.whatsapp.com/send/?phone=19177012145&text&type=phone_number&app_absent=0"
                      class="text-[#ba6352] underline"
                      target="_blank"
                    >
                      WhatsApp
                    </a>
                    : (917) 701-2145
                  </div>
                  <div>
                    email&nbsp;
                    <a href="mailto:care@cozyology.com" class="text-[#ba6352] underline" target="_blank">
                      Care@Cozyology.com
                    </a>
                    .
                  </div>
                  <div>and we'll do the rest.</div>
                </div>`,
  contactDetailsMobile: `<div class="font-bold text-black">Need help with measurements?</div>
                <div class="font-bold text-black">
                  Scan the QR code or&nbsp;
                  <a href="mailto:care@cozyology.com" class="text-[#c16452]" target="_blank">
                    add us
                  </a>
                  &nbsp; on
                </div>
                <div class="text-gray-500 mt-[10px]">
                  <a
                    href="https://api.whatsapp.com/send/?phone=19177012145&text&type=phone_number&app_absent=0"
                    class="text-[#ba6352] underline"
                    target="_blank"
                  >
                    WhatsApp
                  </a>
                  : (917) 701-2145
                </div>`,
  measurementConfig: {
    'step-1': {
      type: 'select',
      title: 'Which Drape Header Style Do You Prefer?',
      options: [
        {
          id: 'soft-top',
          title: 'SOFT TOP',
          imageClass: 'image-soft-top',
          alt: 'Soft Top',
          description: 'For a soft natural look<br />· Rod Pocket',
          jump: 'step-2-0',
        },
        {
          id: 'pleated',
          title: 'PLEATED',
          imageClass: 'image-pleated',
          alt: 'Pleated',
          description: 'For a luxurious full look<br />· Double pinch pleat <br />· tripple pinch pleat',
          jump: 'step-2-0',
        },
        {
          id: 'grommets',
          title: 'GROMMETS',
          imageClass: 'image-grommets',
          alt: 'Grommets',
          description: 'For a structured modern look <br />· Grommets',
          jump: 'step-2-0',
        },
      ],
    },
    'step-2-0': {
      type: 'select',
      title: 'Drapery Rod Installed?',
      options: [
        {
          id: 'rod-installed-yes',
          title: 'Yes',
          imageClass: 'image-drapery-02-1',
          description: 'I have a rod installed already',
          jump: 'step-2-1-1',
        },
        {
          id: 'rod-installed-no',
          title: 'No',
          imageClass: 'image-drapery-02-2',
          description: `I don't have a rod installed yet<br />For more accurate measurement, we recommend you have the rod or track installed`,
          jump: 'step-2-2-1',
        },
      ],
    },
    'step-2-1-1': {
      type: 'input',
      title: 'Rod Length?',
      subTitle: 'For accuracy, please use a steel measuring tape.',
      imageClass: 'image-drapery-02-3',
      jump: 'step-3-1-1',
      options: [
        {
          id: 'rod-width-top',
          title: 'A',
          label: 'Width',
          min: 0,
          max: 280,
        },
      ],
    },
    'step-2-2-1': {
      type: 'input',
      title: 'Window Width? (Frame outer edge to edge)',
      subTitle: 'For accuracy, please use a steel measuring tape.',
      imageClass: 'image-drapery-02-4',
      jump: 'step-2-2-2',
      options: [
        {
          id: 'norod-window-width',
          title: '',
          label: '',
          min: 0,
          max: 280,
        },
      ],
    },
    'step-2-2-2': {
      type: 'input',
      title: 'Rod Extension Width Beyond Frame?',
      subTitle: 'For accuracy, please use a steel measuring tape.',
      imageClass: 'image-drapery-02-5',
      jump: 'step-3-2-1',
      options: [
        {
          id: 'norod-width-left-extension',
          title: 'A',
          label: 'Left Side',
          min: 0,
          max: 280,
        },
        {
          id: 'norod-width-right-extension',
          title: 'B',
          label: 'Right Side',
          min: 0,
          max: 280,
        },
      ],
    },
    'step-3-1-1': {
      type: 'input',
      title: 'Window Top to Floor Height?',
      subTitle: 'For accuracy, please use a steel measuring tape.',
      imageClass: 'image-drapery-03-1',
      jump: 'step-3-1-2',
      options: [
        {
          id: 'top-to-floor-height',
          title: 'A',
          label: 'Height',
          min: 0,
          max: 280,
        },
      ],
    },
    'step-3-1-2': {
      type: 'input',
      title: 'Rod Extension Above Frame?',
      subTitle: 'For accuracy, please use a steel measuring tape.',
      imageClass: 'image-drapery-03-2',
      description: `Ceiling under 10 ft: Mount 3–5" below the ceiling to make the space feel taller and more refined. <br />
Ceiling over 10 ft: Keep the rod within 18" above the window frame to maintain balanced proportions.<br />
Pleated: Measure from the rod to the floor. We automatically subtract 1 inches for the ring's radius.`,
      jump: 'step-3-1-3',
      options: [
        {
          id: 'rod-extension-above-frame',
          title: '',
          label: 'Height',
          min: 0,
          max: 280,
        },
      ],
    },
    'step-3-1-3': {
      type: 'select',
      title: 'Curtain Length Style?',
      options: [
        {
          id: 'length-style-above-floor',
          title: '1/2‘’ ABOVE FLOOR',
          imageClass: 'image-drapery-03-3',
          description: 'Most recommended<br />Easy upkeep, smooth operation, with a sleek look.',
          jump: 'step-4-1',
        },
        {
          id: 'length-style-breaks-on-floor',
          title: 'BREAK ON THE FLOOR',
          imageClass: 'image-drapery-03-4',
          description: 'The Custom-Fit<br />A polished appearance, demands precise  measurement.',
          jump: 'step-4-1',
        },
        {
          id: 'length-style-puddles-on-floor',
          title: 'SLIGHT PUDDLE ON FLOOR',
          imageClass: 'image-drapery-03-5',
          description: 'The Plush Choice<br />Rich and striking, but requires more cleaning',
          jump: 'step-4-1',
        },
      ],
    },
    'step-4-1': {
      title: 'Single or Split Panels?',
      type: 'select',
      options: [
        {
          id: 'single-panels',
          title: 'SINGLE',
          imageClass: 'image-drapery-04-1',
          jump: 'step-4-2',
        },
        {
          id: 'split-panels',
          title: 'SPLIT',
          imageClass: 'image-drapery-04-2',
          jump: 'step-4-2',
        },
      ],
    },
    'step-4-2': {
      title: '',
      type: 'finished',
      options: [],
    },
  },
}

export default function MeasurementTool({ shopNowUrl }: MeasurementToolProps) {
  const [currentStep, setCurrentStep] = useState('step-1')
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [stepHistory, setStepHistory] = useState<string[]>(['step-1']) // 记录步骤历史
  const [inputValues, setInputValues] = useState<Record<string, number>>({}) // 记录所有输入值
  const [currentStepInputs, setCurrentStepInputs] = useState<Record<string, string>>({}) // 当前步骤的输入值
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({}) // 输入错误信息
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({}) // 记录每个步骤选择的选项ID

  const getCurrentMainStep = (): string => {
    if (currentStep === 'step-1') return 'step-1'
    if (currentStep.startsWith('step-2')) return 'step-2'
    if (currentStep.startsWith('step-3')) return 'step-3'
    if (currentStep === 'step-finished') return 'step-finished'
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
      case 'step-finished':
        return completedSteps.includes('step-finished')
      default:
        return false
    }
  }

  // 定义主要步骤列表
  const mainSteps = ['step-1', 'step-2', 'step-3', 'step-finished']
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
    if (actualStep === 'step-finished') return 'step-finished'
    return 'step-1'
  }

  const getActualStepFromMainStep = (mainStepId: string): string => {
    switch (mainStepId) {
      case 'step-1':
        return 'step-1'
      case 'step-2':
        // 返回已完成的最后一个step-2子步骤，或第一个step-2步骤
        const step2Options = ['step-2-1-1', 'step-2-2-1', 'step-2-2-2']
        const completedStep2 = step2Options.filter(step => completedSteps.includes(step))
        return completedStep2.length > 0 ? completedStep2[completedStep2.length - 1] : 'step-2-1-1'
      case 'step-3':
        // 返回已完成的最后一个step-3子步骤，或第一个step-3步骤
        const step3Options = ['step-3-1-1', 'step-3-2-1']
        const completedStep3 = step3Options.filter(step => completedSteps.includes(step))
        return completedStep3.length > 0 ? completedStep3[completedStep3.length - 1] : 'step-3-1-1'
      case 'step-finished':
        return 'step-finished'
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

  // 将小数转换为分数格式的函数
  const convertToFraction = (decimal: number): string => {
    const wholeNumber = Math.floor(decimal)
    const fractionalPart = decimal - wholeNumber

    // 转换为最接近的 1/8 英寸
    const eighths = Math.round(fractionalPart * 8)

    if (eighths === 0) {
      return wholeNumber.toString()
    }

    if (eighths === 8) {
      return (wholeNumber + 1).toString()
    }

    // 简化分数
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    const divisor = gcd(eighths, 8)
    const numerator = eighths / divisor
    const denominator = 8 / divisor

    if (wholeNumber === 0) {
      return `${numerator}/${denominator}`
    }

    return `${wholeNumber} ${numerator}/${denominator}`
  }

  // 计算最终的推荐尺寸
  const calculateRecommendedSize = (): { width: string; height: string } => {
    // 判断是内装还是外装
    const isInsideMount = completedSteps.some(step => step.includes('step-2-1'))

    let width = 0
    let height = 0

    if (isInsideMount) {
      // 内装计算
      // 宽度：取三个测量值中的最小值，然后减去 3/8 英寸间隙
      const widthValues = [
        inputValues['inside-width-top'],
        inputValues['inside-width-middle'],
        inputValues['inside-width-bottom'],
      ].filter(v => v !== undefined)

      if (widthValues.length > 0) {
        width = Math.min(...widthValues) - 0.375 // 减去 3/8 英寸
      }

      // 高度：取三个测量值中的最大值
      const heightValues = [
        inputValues['inside-height-left'],
        inputValues['inside-height-middle'],
        inputValues['inside-height-right'],
      ].filter(v => v !== undefined)

      if (heightValues.length > 0) {
        height = Math.max(...heightValues)

        // 如果选择了 puddles 样式，增加 2 英寸
        if (completedSteps.some(step => step.includes('puddles'))) {
          height += 2
        }
      }
    } else {
      // 外装计算
      // 宽度：窗户宽度 + 左侧延伸 + 右侧延伸
      const windowWidth = inputValues['outside-window-width'] || 0
      const leftExtension = inputValues['outside-width-left-extension'] || 0
      const rightExtension = inputValues['outside-width-right-extension'] || 0
      width = windowWidth + leftExtension + rightExtension

      // 高度：窗户高度 + 上方延伸
      const windowHeight = inputValues['outside-window-height'] || 0
      const aboveExtension = inputValues['outside-height-above-extension'] || 0
      height = windowHeight + aboveExtension

      // 如果选择了 puddles 样式，增加 2 英寸
      if (completedSteps.some(step => step.includes('puddles'))) {
        height += 2
      }
    }

    return {
      width: convertToFraction(width),
      height: convertToFraction(height),
    }
  }

  // 获取安装类型描述
  const getMountTypeDescription = (): string => {
    const isInsideMount = completedSteps.some(step => step.includes('step-2-1'))
    return isInsideMount ? 'Inside Mount' : 'Outside Mount'
  }

  // 获取长度样式描述
  const getLengthStyleDescription = (): string => {
    // 检查 step-3-1-2 (Inside Mount 长度样式)
    const insideLengthOption = selectedOptions['step-3-1-2']
    if (insideLengthOption) {
      if (insideLengthOption === 'inside-length-breaks-on-frame') {
        return 'Breaks on Window Frame'
      }
      if (insideLengthOption === 'inside-length-puddles-on-frame') {
        return 'Puddles on Window Frame'
      }
    }

    // 检查 step-3-2-3 (Outside Mount 长度样式)
    const outsideLengthOption = selectedOptions['step-3-2-3']
    if (outsideLengthOption) {
      if (outsideLengthOption === 'outside-length-breaks-on-frame') {
        return 'Breaks on Window Frame'
      }
      if (outsideLengthOption === 'outside-length-puddles-on-frame') {
        return 'Puddles on Window Frame'
      }
    }

    return 'Standard Length'
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

            if (!value || value.trim() === '' || isNaN(parseFloat(value))) {
              if (option.max) {
                return `${fieldName}: Please enter a number between ${option.min} and ${option.max}`
              } else {
                return `${fieldName}: Please enter a number between ${option.min} and above`
              }
            }

            const numValue = parseFloat(value)
            if (numValue < option.min || (option.max && numValue > option.max)) {
              if (option.max) {
                return `${fieldName}: Please enter a number between ${option.min} and ${option.max}`
              } else {
                return `${fieldName}: Please enter a number between ${option.min} and above`
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

    // 如果当前步骤是 step-1 且历史记录中有超过一个步骤，说明用户重新选择了第一步
    // 需要清空之前的历史和已完成步骤，重新开始
    if (currentStep === 'step-1' && stepHistory.length > 1) {
      setCompletedSteps([currentStep])
      setStepHistory(['step-1', jump])
      setInputValues({}) // 清空所有之前的输入值
      setSelectedOptions({}) // 清空所有之前的选择
    } else {
      // 记录当前步骤为已完成
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep])
      }

      // 添加到历史记录
      setStepHistory(prev => [...prev, jump])
    }

    // 清空当前步骤输入和错误信息
    setCurrentStepInputs({})
    setInputErrors({})

    setCurrentStep(jump)

    // 如果跳转到输入步骤，恢复之前保存的输入值
    restoreInputsForStep(jump)

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
    window.open(shopNowUrl, '_blank')
  }

  const currentStepData = CozyologyConfig.measurementConfig[currentStep]

  const stepWrapRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col lg:flex-row" ref={stepWrapRef}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[35%] bg-white">
        <div className="flex flex-col h-full justify-center">
          <div className="">
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
              {getPreviousStep() && (
                <div className="mb-4">
                  <button
                    onClick={() => {
                      const prevStep = getPreviousStep()!
                      setCurrentStep(prevStep)
                      restoreInputsForStep(prevStep)
                    }}
                    className="flex items-center gap-2 cursor-pointer"
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
                </div>
              )}
              <div className="text-center mb-7 text-gray-900 not-md:mb-6">
                <h1 className="text-[30px] font-americana not-md:text-[18px]">{currentStepData.title}</h1>
                {currentStepData.subTitle && (
                  <div className="text-[16px] not-md:text-[12px] text-[#333]">{currentStepData.subTitle}</div>
                )}
              </div>
              {currentStepData.type === 'select' && (
                <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch">
                  {currentStepData.options.map(option => (
                    <div
                      key={option.id}
                      className="group md:min-h-[600px] transition-all duration-200 hover:bg-[#F5F5F5] flex flex-col relative cursor-pointer not-md:bg-[#F5F5F5] not-md:w-full not-md:h-auto md:flex-1"
                      onClick={() => handleContinue(option.jump, option.id)}
                    >
                      <div className="p-[40px] pb-[70px] flex-1 flex flex-col gap-5 not-md:gap-[14px] not-md:flex-row not-md:p-4">
                        <div className="w-[320px] aspect-square mx-auto relative md:w-[240px] not-md:w-[160px] not-md:h-[160px]">
                          <div className={`option-image ${option.imageClass}`} />
                        </div>
                        <div className="flex-1 md:text-center">
                          <h3 className="text-[24px] text-[#171717] not-md:text-[15px]">{option.title}</h3>
                          <div className="h-[1px] bg-[#DDDDDD] my-5 not-md:my-[10px]"></div>
                          <div
                            className="text-[16px] text-[#171717] not-md:text-[12px]"
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
                    <div className="w-full not-md:w-[60%]">
                      <div className={`step-image ${currentStepData.imageClass}`} />
                    </div>
                    <div
                      className="md:hidden not-md:w-[40%] text-[14px]"
                      dangerouslySetInnerHTML={{ __html: currentStepData.description }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col not-md:w-full">
                    <div
                      className="not-md:hidden text-[16px]"
                      dangerouslySetInnerHTML={{ __html: currentStepData.description }}
                    />
                    <div className="flex-1 flex flex-col justify-end gap-[20px] not-md:gap-[15px]">
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
                  <div className="flex flex-col items-center bg-[#F5F5F5] py-[70px] not-md:py-[25px] px-[30px] xl:px-[120px]">
                    <div className="text-[20px] font-medium text-black not-md:text-[12px]">
                      Your recommended shade size is&nbsp;
                    </div>
                    <div className="md:hidden w-full h-[1px] bg-[#DDD] my-[15px]"></div>
                    <div className="text-[60px] text-black mt-[30px] not-md:my-[0] not-md:text-[35px] font-americana">
                      {(() => {
                        const { width, height } = calculateRecommendedSize()
                        return `${width}"W × ${height}"L`
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
                    <div className="mt-[50px] text-[16px] text-center text-[#999999] not-md:text-[12px] not-md:mt-[20px]">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: CozyologyConfig.resultTexts?.screenshotReminder || '',
                        }}
                      />
                    </div>

                    <div className="mt-[50px] flex w-full text-center">
                      <div className="flex-1 flex flex-col items-center">
                        <div className="text-[16px] text-[#999] font-americana mb-[24px]">MOUNT STYLE</div>
                        <div className="text-[16px] font-americana">{getMountTypeDescription()}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-center border-l border-[#DDD]">
                        <div className="text-[16px] text-[#999] font-americana  mb-[24px]">LENGTH STYLE</div>
                        <div className="text-[16px] font-americana">{getLengthStyleDescription()}</div>
                      </div>
                    </div>

                    <div className="not-md:hidden mt-[50px] flex gap-[30px] w-full">
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
