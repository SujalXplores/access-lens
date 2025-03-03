'use client';

import { useState } from 'react';
import URLInput from './components/URLInput';
import PreferencesPanel, { AccessibilityPreferences } from './components/PreferencesPanel';
import TransformedContent from './components/TransformedContent';
import { MoveUpRight, Sparkles, Wand2 } from 'lucide-react';

interface TransformResult {
  content: string;
  title: string;
  originalUrl: string;
  preferences: AccessibilityPreferences;
}

export default function Home() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    simplifyContent: true,
    enhanceContrast: false,
    increaseFontSize: false,
    removeAnimations: false,
    readingAssistance: false,
  });

  const [transformResult, setTransformResult] = useState<TransformResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleURLSubmit = async (url: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, preferences }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transform the webpage');
      }

      const result = await response.json();
      setTransformResult(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTransformResult(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

      <main className="relative container mx-auto px-6 py-16 lg:px-8 lg:py-20">
        {!transformResult ? (
          <div className="relative">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center justify-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-slate-600 dark:text-slate-300 shadow-sm dark:bg-slate-800/70">
                <Wand2 className="h-4 w-4" />
                <span>Making the web accessible for everyone</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="inline-flex flex-col items-center gap-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
                  <span className="text-blue-600 dark:text-blue-500">
                    AccessLens
                  </span>
                  <Sparkles className="h-12 w-12 text-blue-500 dark:text-blue-600" />
                </h1>
                <p className="text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Transform any webpage into an accessible version tailored to your needs.
                  Simply enter a URL below to begin.
                </p>
              </div>
            </div>

            <div className="mt-16 space-y-10 max-w-4xl mx-auto">
              <div className="relative">
                <URLInput onSubmit={handleURLSubmit} />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-500 dark:border-blue-900 dark:border-t-blue-600 animate-spin" />
                      </div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Transforming webpage...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50/50 px-6 py-4 text-sm text-red-500 shadow-sm dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500/70 dark:bg-red-400/70" />
                    {error}
                  </div>
                </div>
              )}

              <PreferencesPanel
                preferences={preferences}
                onChange={setPreferences}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={handleReset}
              className="group inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <MoveUpRight className="h-4 w-4" />
              Back to URL input
            </button>
            <TransformedContent {...transformResult} />
          </div>
        )}

        <footer className="mt-24 pb-8">
          <div className="max-w-4xl mx-auto space-y-6">            
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <span className="font-medium">AccessLens</span> — Making the web accessible for everyone
              </div>
            </div>
            
            <div className="text-center text-xs text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} AccessLens. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
