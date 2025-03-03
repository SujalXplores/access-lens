import { JSDOM } from 'jsdom';

interface AITransformationResult {
  content: string;
  summary?: string;
  readingLevel?: string;
  contrastRatio?: number;
  suggestedFontSize?: number;
}

// Helper function to calculate color contrast ratio
function calculateContrastRatio(color1: string, color2: string): number {
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const color1rgb = hexToRgb(color1);
  const color2rgb = hexToRgb(color2);
  
  const l1 = getLuminance(color1rgb.r, color1rgb.g, color1rgb.b);
  const l2 = getLuminance(color2rgb.r, color2rgb.g, color2rgb.b);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Helper function to extract text content
function extractTextContent(html: string): string {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Remove script and style elements
  document.querySelectorAll('script, style').forEach(el => el.remove());
  
  // Get main content (prefer main content areas)
  const mainContent = document.querySelector('main, article, #main, #content, .main, .content');
  return (mainContent || document.body).textContent?.trim() || '';
}

// Helper function to estimate reading level
function estimateReadingLevel(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = words.reduce((count, word) => {
    return count + word.toLowerCase().split(/[^aeiouy]+/).filter(Boolean).length;
  }, 0);

  // Flesch-Kincaid Grade Level formula
  const grade = 0.39 * (words.length / sentences.length) + 11.8 * (syllables / words.length) - 15.59;
  
  if (grade <= 6) return '6th Grade or below';
  if (grade <= 8) return '8th Grade';
  if (grade <= 10) return '10th Grade';
  if (grade <= 12) return '12th Grade';
  return 'College Level';
}

export async function transformContent(
  html: string
): Promise<AITransformationResult> {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Clean up the HTML and get main content text
  const textContent = extractTextContent(html);
  
  // Calculate reading level
  const readingLevel = estimateReadingLevel(textContent);

  // Analyze contrast
  let worstContrastRatio = Infinity;
  document.querySelectorAll('*').forEach((el: Element) => {
    const styles = dom.window.getComputedStyle(el as HTMLElement);
    const bgColor = styles.backgroundColor;
    const textColor = styles.color;
    if (bgColor && textColor) {
      const ratio = calculateContrastRatio(bgColor, textColor);
      worstContrastRatio = Math.min(worstContrastRatio, ratio);
    }
  });

  // Generate a summary using the first few paragraphs
  const paragraphs = Array.from(document.querySelectorAll('p'))
    .map(p => p.textContent?.trim())
    .filter(Boolean)
    .slice(0, 3);
  const summary = paragraphs.join(' ');

  // Return original content with analysis
  return {
    content: html, // Return original HTML content
    summary: summary.length > 300 ? summary.slice(0, 297) + '...' : summary,
    readingLevel,
    contrastRatio: Number(worstContrastRatio.toFixed(1)),
    suggestedFontSize: 16,
  };
}

export async function analyzeAccessibility(html: string): Promise<{
  issues: string[];
  suggestions: string[];
}> {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for images without alt text
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} images lack alt text`);
    suggestions.push('Add descriptive alt text to all images');
  }

  // Check for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading: Element) => {
    const level = parseInt(heading.tagName[1]);
    if (level - previousLevel > 1) {
      issues.push(`Heading hierarchy skips from H${previousLevel} to H${level}`);
      suggestions.push('Ensure heading levels are properly nested');
    }
    previousLevel = level;
  });

  // Check for form accessibility
  const formElements = document.querySelectorAll('input, select, textarea');
  formElements.forEach((el: Element) => {
    if (!el.hasAttribute('label') && !el.hasAttribute('aria-label')) {
      issues.push(`Form element missing label: ${el.getAttribute('name') || el.getAttribute('id') || 'unnamed element'}`);
      suggestions.push('Add labels or aria-labels to all form elements');
    }
  });

  // Check for color contrast
  const elements = document.querySelectorAll('*');
  let hasContrastIssues = false;
  elements.forEach((el: Element) => {
    const styles = dom.window.getComputedStyle(el as HTMLElement);
    const bgColor = styles.backgroundColor;
    const textColor = styles.color;
    if (bgColor && textColor) {
      const ratio = calculateContrastRatio(bgColor, textColor);
      if (ratio < 4.5) {
        hasContrastIssues = true;
      }
    }
  });
  if (hasContrastIssues) {
    issues.push('Some text elements have insufficient color contrast');
    suggestions.push('Increase color contrast to meet WCAG 2.1 AA standards (minimum 4.5:1)');
  }

  // Check for interactive elements accessibility
  const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
  interactiveElements.forEach((el: Element) => {
    if (!el.hasAttribute('aria-label') && !el.textContent?.trim()) {
      issues.push('Interactive element lacks accessible name');
      suggestions.push('Add aria-labels to interactive elements without visible text');
    }
  });

  return {
    issues: issues.length > 0 ? issues : ['No major accessibility issues detected'],
    suggestions: suggestions.length > 0 ? suggestions : ['Continue maintaining good accessibility practices'],
  };
} 