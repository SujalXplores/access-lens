'use client';

import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface AccessibilityPreferences {
  simplifyContent: boolean;
  enhanceContrast: boolean;
  increaseFontSize: boolean;
  removeAnimations: boolean;
  readingAssistance: boolean;
}

interface PreferencesPanelProps {
  preferences: AccessibilityPreferences;
  onChange: (preferences: AccessibilityPreferences) => void;
}

export default function PreferencesPanel({ preferences, onChange }: PreferencesPanelProps) {
  const togglePreference = (key: keyof AccessibilityPreferences) => {
    onChange({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  const PreferenceToggle = ({ 
    label, 
    description, 
    prefKey 
  }: { 
    label: string; 
    description: string; 
    prefKey: keyof AccessibilityPreferences;
  }) => (
    <div
      className={cn(
        "group flex items-center justify-between space-x-4 rounded-lg border p-4",
        preferences[prefKey] 
          ? "border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10" 
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      )}
    >
      <div className="space-y-1.5">
        <label
          htmlFor={prefKey}
          className="text-base font-medium leading-none text-slate-900 dark:text-slate-100"
        >
          {label}
        </label>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <Switch
        id={prefKey}
        checked={preferences[prefKey]}
        onCheckedChange={() => togglePreference(prefKey)}
      />
    </div>
  );

  return (
    <Card className="border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm dark:bg-slate-900/80 dark:border-slate-800">
      <CardHeader className="space-y-2 pb-6 border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Accessibility Preferences
        </CardTitle>
        <CardDescription className="text-base text-slate-500 dark:text-slate-400">
          Customize your reading experience with these options
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 pt-6">
        <PreferenceToggle
          label="Simplify Content"
          description="Make text easier to understand by simplifying complex language and improving readability"
          prefKey="simplifyContent"
        />
        <PreferenceToggle
          label="Enhance Contrast"
          description="Improve text visibility by increasing contrast between text and background"
          prefKey="enhanceContrast"
        />
        <PreferenceToggle
          label="Increase Font Size"
          description="Make text larger and more readable for comfortable viewing"
          prefKey="increaseFontSize"
        />
        <PreferenceToggle
          label="Remove Animations"
          description="Create a calmer experience by disabling moving elements and transitions"
          prefKey="removeAnimations"
        />
        <PreferenceToggle
          label="Reading Assistance"
          description="Enable interactive tools to help guide your reading and maintain focus"
          prefKey="readingAssistance"
        />
      </CardContent>
    </Card>
  );
} 