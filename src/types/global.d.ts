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
      }
      contactDetails: string
      contactDetailsMobile: string
      measurementConfig: any
    }
  }
}

export {}
