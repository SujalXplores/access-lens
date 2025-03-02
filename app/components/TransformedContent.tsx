'use client';

import { AccessibilityPreferences } from './PreferencesPanel';
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { BookOpen, ExternalLink, Sparkles } from 'lucide-react';

interface TransformedContentProps {
  content: string;
  title: string;
  originalUrl: string;
  preferences: AccessibilityPreferences;
}

export default function TransformedContent({
  content,
  title,
  originalUrl,
  preferences,
}: TransformedContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Apply accessibility transformations based on preferences
      if (preferences.increaseFontSize) {
        contentRef.current.style.fontSize = '120%';
      }

      if (preferences.enhanceContrast) {
        contentRef.current.style.filter = 'contrast(1.2)';
      }

      if (preferences.removeAnimations) {
        const style = document.createElement('style');
        style.textContent = `
          * {
            animation: none !important;
            transition: none !important;
          }
        `;
        document.head.appendChild(style);
        return () => style.remove();
      }
    }
  }, [preferences]);

  return (
    <Card className="border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm dark:bg-slate-900/80 dark:border-slate-800">
      <CardHeader className="space-y-4 bg-slate-50/80 dark:bg-slate-800/20 rounded-t-lg border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            <Sparkles className="h-5 w-5 text-blue-500 dark:text-blue-600" />
          </div>
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors w-fit rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1.5"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="group-hover:underline truncate max-w-[500px]">{originalUrl}</span>
          </a>
        </div>
      </CardHeader>

      <CardContent className="prose dark:prose-invert max-w-none pt-6">
        <div
          ref={contentRef}
          className="[&>*:first-child]:mt-0 space-y-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>

      {preferences.readingAssistance && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => {
              alert('Reading assistance features coming soon!');
            }}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-sm"
            size="default"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Reading Assistant
          </Button>
        </div>
      )}
    </Card>
  );
} 