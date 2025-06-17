declare global {
  interface Window {
    CozyologyConfig: {
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
