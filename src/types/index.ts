export interface AccessibilityPreferences {
  simplifyContent: boolean
  enhanceVisuals: boolean
  readingAssistance: boolean
}

export interface TransformedContent {
  title: string
  content: string
  metadata: {
    originalUrl: string
    transformedAt: string
  }
} 