import { URLInput } from '@/components/URLInput'
import { AccessibilityControls } from '@/components/AccessibilityControls'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          AccessLens
        </h1>
        <div className="mb-8">
          <URLInput />
        </div>
        <div className="mb-8">
          <AccessibilityControls />
        </div>
        <div id="content-display" className="bg-white rounded-lg shadow-lg p-6">
          {/* Transformed content will be displayed here */}
        </div>
      </div>
    </main>
  )
} 