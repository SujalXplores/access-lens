import { NextRequest, NextResponse } from 'next/server';
import { AccessibilityPreferences } from '../../../app/components/PreferencesPanel';
import { transformContent, analyzeAccessibility } from '../../lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { url, preferences } = await request.json() as {
      url: string;
      preferences: AccessibilityPreferences;
    };

    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid URL format';
      return NextResponse.json(
        { error: 'Invalid URL provided: ' + errorMessage },
        { status: 400 }
      );
    }

    // Fetch the webpage content
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch the webpage' },
        { status: response.status }
      );
    }

    const html = await response.text();
    
    // Extract title
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1] || 'Untitled Page';

    // Transform content using AI
    const [transformedContent, accessibilityAnalysis] = await Promise.all([
      transformContent(html),
      analyzeAccessibility(html),
    ]);

    const processedContent = {
      originalUrl: url,
      title,
      ...transformedContent,
      accessibility: accessibilityAnalysis,
      preferences,
    };

    return NextResponse.json(processedContent);
  } catch (error) {
    console.error('Error processing URL:', error);
    return NextResponse.json(
      { error: 'Failed to process the webpage' },
      { status: 500 }
    );
  }
} 