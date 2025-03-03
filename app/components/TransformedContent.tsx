'use client';

import { AccessibilityPreferences } from './PreferencesPanel';
import { AlertTriangle, Eye, FileText, List, CheckCircle } from 'lucide-react';

interface TransformedContentProps {
  content: string;
  title: string;
  originalUrl: string;
  preferences: AccessibilityPreferences;
  summary?: string;
  readingLevel?: string;
  contrastRatio?: number;
  suggestedFontSize?: number;
  accessibility?: {
    issues: string[];
    suggestions: string[];
  };
}

export default function TransformedContent({
  title,
  originalUrl,
  summary,
  readingLevel,
  contrastRatio,
  suggestedFontSize,
  accessibility,
}: TransformedContentProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Accessibility Analysis for: {title}
        </h2>
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View original page
        </a>
      </div>

      {summary && (
        <div className="space-y-4 p-6 rounded-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <FileText className="h-5 w-5" />
            <h3 className="font-medium">Page Overview</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-6 rounded-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Eye className="h-5 w-5" />
            <h3 className="font-medium">Content Accessibility Metrics</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Reading Level:</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{readingLevel}</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 dark:bg-blue-600 rounded-full"
                  style={{ 
                    width: readingLevel === 'College Level' ? '100%' :
                           readingLevel === '12th Grade' ? '80%' :
                           readingLevel === '10th Grade' ? '60%' :
                           readingLevel === '8th Grade' ? '40%' : '20%'
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Contrast Ratio:</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{contrastRatio}:1</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    (contrastRatio || 0) >= 7 ? 'bg-green-500 dark:bg-green-600' :
                    (contrastRatio || 0) >= 4.5 ? 'bg-yellow-500 dark:bg-yellow-600' :
                    'bg-red-500 dark:bg-red-600'
                  }`}
                  style={{ width: `${Math.min(((contrastRatio || 0) / 21) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(contrastRatio || 0) >= 7 ? 'Excellent - Meets AAA standards' :
                 (contrastRatio || 0) >= 4.5 ? 'Good - Meets AA standards' :
                 'Poor - Below WCAG standards'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Recommended Font Size:</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{suggestedFontSize}px</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Minimum recommended size for comfortable reading
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 rounded-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-medium">Critical Issues</h3>
          </div>
          <ul className="space-y-3 text-sm">
            {accessibility?.issues.map((issue, index) => (
              <li key={index} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <div className="mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500/70 dark:bg-red-400/70" />
                </div>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4 p-6 rounded-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <CheckCircle className="h-5 w-5" />
          <h3 className="font-medium">Detailed Improvement Recommendations</h3>
        </div>
        <div className="space-y-4">
          {accessibility?.suggestions.map((suggestion, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="mt-1">
                  <List className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 