'use client';

import { useState } from 'react';
import { Input } from '../../src/components/ui/input';
import { Button } from '../../src/components/ui/button';
import { Card, CardContent } from '../../src/components/ui/card';
import { ArrowRight, Globe, Loader2 } from 'lucide-react';

interface URLInputProps {
  onSubmit: (url: string) => Promise<void>;
}

export default function URLInput({ onSubmit }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Please enter a valid HTTP or HTTPS URL');
      }

      setIsLoading(true);
      await onSubmit(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please enter a valid URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm dark:bg-slate-900/80 dark:border-slate-800">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="pl-10 pr-32 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:border-blue-500/50 dark:focus-visible:border-blue-600/50 focus-visible:ring-1 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-600/20"
              disabled={isLoading}
            />
            <div className="absolute right-1">
              <Button
                type="submit"
                disabled={isLoading}
                size="default"
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    Transform
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500/70 dark:bg-red-400/70" />
              {error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 