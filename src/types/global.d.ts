declare global {
  interface Window {
    CozyologyConfig: {
      shopNowUrl?: string
      stepTitles: Record<string, string>
      resultTexts: {
        orderInstructions: string
        screenshotReminder: string
        mountStyleLabel?: string
        lengthStyleLabel?: string
      }
      contactDetails: string
      contactDetailsMobile: string
      contactBookNowUrl?: string
      measurementConfig: any
    }
    CozyologyConfig_Drapery: {
      shopNowUrl?: string
      stepTitles: Record<string, string>
      resultTexts: {
        orderInstructions: string
        screenshotReminder: string
        mountStyleLabel?: string
        lengthStyleLabel?: string
        finishedTitle?: string
        finishedTitleOfRippleFold?: string
      }
      contactDetails: string
      contactDetailsMobile: string
      contactBookNowUrl?: string
      measurementConfig: any
      trackSelectorOptions: {
        pleated: {
          ceiling: Array<SelectOptionProp>
          wall: Array<SelectOptionProp>
        }
      }
      trackSelectorSingleOptions: Record<string, Array<SelectOptionProp>>
      resultPageTip?: string
    }
  }
}

interface SelectOptionProp {
  label: string
  value: string
  link?: string
}

type SelectOptionPropReturns = Partial<SelectOptionProp & { key: number }>

export { SelectOptionProp, SelectOptionPropReturns }
