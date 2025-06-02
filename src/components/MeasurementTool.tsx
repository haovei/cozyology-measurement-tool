'use client'

import { useState } from 'react'
import { StepDataList } from '../data/mountStyles'

export default function MeasurementTool() {
  const [currentStep, setCurrentStep] = useState('step-1')
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [stepHistory, setStepHistory] = useState<string[]>(['step-1']) // 记录步骤历史

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
    switch (stepKey) {
      case 'step-1':
        return 'Choose Mount Style'
      case 'step-2':
        return 'Specify Window Width'
      case 'step-3':
        return 'Specify Window Height'
      case 'step-finished':
        return 'Finished'
      default:
        return 'Step'
    }
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
      setCurrentStep(targetStep)

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
        }
      }
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

  const handleContinue = jump => {
    console.log('Continuing to:', jump)

    // 记录当前步骤为已完成
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
    }

    // 添加到历史记录
    setStepHistory(prev => [...prev, jump])

    setCurrentStep(jump)
  }

  const handleCalculateAgain = () => {
    setCurrentStep('step-1')
    setCompletedSteps([])
    setStepHistory(['step-1']) // 重置历史记录
  }

  const currentStepData = StepDataList[currentStep]

  return (
    <div className="">
      <div className="flex flex-col md:py-6  md:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-[40%] bg-white">
          <div className="flex flex-col h-full pt-6">
            <div className="flex-1 ">
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
                        ? 'text-black font-medium text-[22px] leading-[30px] cursor-pointer'
                        : step.completed
                          ? 'text-black text-[18px] leading-none cursor-pointer'
                          : 'text-[#ccc] text-[18px] leading-none cursor-not-allowed'
                    }`}
                    onClick={() => handleStepNavigation(step.id)}
                  >
                    Step {step.stepNumber} - {step.title}
                  </div>
                </div>
              ))}
            </div>

            {/* QR Code Section */}
            <div className="mt-10">
              <div className="flex items-center gap-[20px]">
                <div className="w-[130px] h-[130px] bg-black rounded flex-shrink-0">
                  <img src="/assets/code@2x.webp" />
                </div>
                <div className="text-[14px]">
                  <div className="font-medium text-black">Need help with measurements?</div>
                  <div className="font-medium text-black">Scan the QR code or add us on</div>
                  <div className="text-gray-500 mt-[20px]">WhatsApp: (917) 701-2145</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Step Indicator */}
        <div className="md:hidden bg-[#F3F3F3] px-8 py-5 overflow-auto">
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
                  className={`w-2.5 h-2.5 rounded-full border-solid transition-colors border-[#DDDDDD] relative z-1 ${
                    step.active
                      ? 'w-4 h-4 bg-black border-4'
                      : step.completed
                        ? 'w-2.5 h-2.5 bg-black border-1 my-[3px]'
                        : 'bg-white border-1 my-[3px]'
                  }`}
                />
                <div
                  className={`text-xs mt-1 transition-colors ${
                    step.active ? 'text-black font-medium mt-1' : step.completed ? 'text-black' : 'text-gray-400'
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
          <div className="md:mx-auto md:py-0 mx-4 py-5 relative">
            {currentStepData && (
              <>
                {getPreviousStep() && (
                  <div className="mb-4">
                    <button
                      onClick={() => setCurrentStep(getPreviousStep()!)}
                      className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors cursor-pointer"
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
                <h1 className="text-[30px] font-americana text-center mb-11 text-gray-900 not-md:text-[18px] not-md:mb-6">
                  {currentStepData.title}
                </h1>

                {currentStepData.type === 'select' && (
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                    {currentStepData.options.map(option => (
                      <div
                        key={option.id}
                        className="group w-[400px] h-[600px] transition-all duration-200 hover:bg-[#F5F5F5] flex flex-col relative cursor-pointer not-md:bg-[#F5F5F5] not-md:w-full not-md:h-auto"
                        onClick={() => handleContinue(option.jump)}
                      >
                        <div className="p-[40px] pb-[50px] flex-1 flex flex-col gap-5 not-md:gap-[14px] not-md:flex-row not-md:p-4">
                          <div className="w-[320px] h-[320px] mx-auto relative not-md:w-[160px] not-md:h-[160px]">
                            <img src={option.image} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 md:text-center">
                            <h3 className="text-[24px] text-[#171717] not-md:text-[15px]">{option.title}</h3>
                            <div className="h-[1px] bg-[#DDDDDD] my-5 not-md:my-[10px]"></div>
                            <div className="text-[16px] text-[#171717] not-md:text-[12px]">{option.description}</div>
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
                      <img src={currentStepData.image} className="w-full object-cover not-md:w-[50%]" />
                      <div className="md:hidden text-[14px]">{currentStepData.description}</div>
                    </div>
                    <div className="flex-1 flex flex-col not-md:w-full">
                      <div className="not-md:hidden text-[14px] text-center">{currentStepData.description}</div>
                      <div className="flex-1 flex flex-col justify-end gap-[30px] not-md:gap-[15px]">
                        {currentStepData.options.map(option => (
                          <div className="flex not-md:flex-col" key={option.id}>
                            {currentStepData.options.length > 1 && (
                              <div className="w-[100px] not-md:flex gap-2">
                                <div className="text-[24px] not-md:text-[12px]">{option.title}</div>
                                <div className="text-[14px] not-md:text-[12px]">{option.label}</div>
                              </div>
                            )}
                            <div className="flex-1 flex items-center gap-2 border border-black h-[60px] bg-white">
                              <input
                                type="number"
                                className="w-full h-[40px] px-4 focus:outline-none focus:border-black text-[24px] not-md:text-[12px]"
                                placeholder={`${option.min}${option.max ? `~${option.max}` : ''}`}
                                min={option.min}
                                max={option.max}
                              />
                              <div className="h-[34px] leading-[34px] px-[20px] border-l">Inches</div>
                            </div>
                          </div>
                        ))}
                        <div className="">
                          <button
                            onClick={() => handleContinue(currentStepData.jump)}
                            className="w-full h-[60px] not-md:h-[40px] text-lg not-md:text-[12px] font-medium transition-all duration-200 bg-black text-white cursor-pointer"
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
                    <div className="flex flex-col items-center bg-[#F5F5F5] py-[70px] px-[120px] not-md:py-[25px] not-md:px-[30px]">
                      <div className="text-[20px] font-medium text-black not-md:text-[12px]">
                        Your recommended shade size is{' '}
                      </div>
                      <div className="text-[60px] text-black mt-[30px] not-md:text-[35px]">30”W * 20”L</div>
                      <div className="mt-[20px] text-[16px] text-center text-[#999999] not-md:text-[12px]">
                        For Inside Mount: <br />
                        The recommended shade width size already includes the 3/8'' clearance adjustment. <br />
                        Shade length = Maximum window height.
                      </div>
                      <div className="mt-[50px] text-[16px] text-center text-[#999999] not-md:text-[12px] not-md:mt-[20px]">
                        Tips: <span className="font-bold">Take a screenshot</span> of these measurements for when you're
                        ready to order.
                      </div>
                      <div className="not-md:hidden mt-[50px] flex gap-[30px]">
                        <button
                          onClick={() => handleContinue(currentStepData.jump)}
                          className="w-[300px] h-[60px] text-lg font-medium transition-all duration-200 bg-black text-white cursor-pointer"
                        >
                          SHOP NOW
                        </button>
                        <button
                          onClick={handleCalculateAgain}
                          className="w-[300px] h-[60px] text-lg font-medium transition-all duration-200 border cursor-pointer"
                        >
                          CALCULATE AGAIN
                        </button>
                      </div>
                      <div className="mt-[50px] text-[16px] text-center text-[#999999] not-md:text-[12px] not-md:mt-[20px]">
                        If the shade dimensions you need are not listed on our website, please contact us at
                        Care@CozyologyCurtains.com before making a purchase. We're here to assist you!
                      </div>
                    </div>
                    <div className="md:hidden mt-[20px] flex gap-[15px]">
                      <button
                        onClick={() => handleContinue(currentStepData.jump)}
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
            <div className="md:hidden mt-8 p-4 bg-[#F6F2EF] rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1 text-[12px]">
                  <div className="font-medium text-black">Need help with measurements?</div>
                  <div className="font-medium text-black">Scan the QR code or add us on</div>
                  <div className="text-gray-500 mt-[10px]">WhatsApp: (917) 701-2145</div>
                </div>
                <div className="w-[65px] h-[65px] bg-black flex-shrink-0">
                  <img src="/assets/code@2x.webp" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
