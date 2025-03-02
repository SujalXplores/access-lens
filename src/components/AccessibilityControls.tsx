'use client'

import { useState } from 'react'

export function AccessibilityControls() {
  const [preferences, setPreferences] = useState({
    simplifyContent: true,
    enhanceVisuals: false,
    readingAssistance: false,
  })

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => togglePreference('simplifyContent')}
        className={`px-4 py-2 rounded-lg ${
          preferences.simplifyContent 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        Simplify Content
      </button>
      <button
        onClick={() => togglePreference('enhanceVisuals')}
        className={`px-4 py-2 rounded-lg ${
          preferences.enhanceVisuals 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        Enhance Visuals
      </button>
      <button
        onClick={() => togglePreference('readingAssistance')}
        className={`px-4 py-2 rounded-lg ${
          preferences.readingAssistance 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        Reading Assistance
      </button>
    </div>
  )
} 