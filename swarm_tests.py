import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StructuredData from '@/components/StructuredData';
import RootLayout from '@/app/layout';
import SearchPage from '@/app/search/page';

// Mocking components that are not the subject of these tests
vi.mock('@/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/components/i18nProvider', () => ({
  I18nProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/components/searchPageClient', () => ({
  default: () => <div data-testid=\"search-client\" />,
}));

describe('StructuredData Component', () => {
  it('renders JSON-LD correctly', () => {
    const testData = { '@context': 'https://schema.org', '@type': 'Thing', name: 'Test' };
    const { container } = render(<StructuredData data={testData} id=\"test-sd\" />);
    
    const script = container.querySelector('script#test-sd');
    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute('type', 'application/ld+json');
    expect(script?.textContent).toBe(JSON.stringify(testData));
  });

  it('escapes < characters to prevent XSS', () => {
    const maliciousData = { name: '<script>alert(\"xss\")</script>' };
    const { container } = render(<StructuredData data={maliciousData} id=\"xss-test\" />);
    
    const script = container.querySelector('script#xss-test');
    // The < should be escaped to \\u003c
    expect(script?.textContent).toContain('\\\\u003cscript');
    expect(script?.textContent).not.toContain('<script');
  });
});

describe('Integration: Layout Schemas', () => {
  it('includes Organization and WebSite schemas in the document', () => {
    // Note: Next.js Layout tests usually require manual inspection of returned JSX in unit tests
    // or E2E tests for the full document. Here we test the logical inclusion.
    const result = RootLayout({ children: <div /> });
    
    // Check for the presence of StructuredData in the head segment of the layout
    const head = result.props.children[0];
    const structuredDataComponents = head.props.children.filter(
      (child: any) => child.type === StructuredData
    );

    expect(structuredDataComponents).toHaveLength(2);
    
    const orgSchema = structuredDataComponents.find((c: any) => c.props.id === 'ld-organization');
    const siteSchema = structuredDataComponents.find((c: any) => c.props.id === 'ld-website');

    expect(orgSchema.props.data['@type']).toBe('Organization');
    expect(orgSchema.props.data.url).toBe('https://paprikaa.netlify.app/');
    
    expect(siteSchema.props.data['@type']).toBe('WebSite');
    expect(siteSchema.props.data.potentialAction.target.urlTemplate).toContain('/search?q={search_term_string}');
  });
});

describe('Integration: Search Page Breadcrumbs', () => {
  it('renders BreadcrumbList schema with valid URLs', () => {
    const { container } = render(<SearchPage />);
    
    const script = container.querySelector('script#ld-breadcrumbs');
    expect(script).toBeInTheDocument();
    
    const data = JSON.parse(script?.textContent || '{}');
    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement).toHaveLength(2);
    
    // Verify specific breadcrumb structure
    expect(data.itemListElement[0].name).toBe('Home');
    expect(data.itemListElement[0].item).toBe('https://paprikaa.netlify.app/');
    
    expect(data.itemListElement[1].name).toBe('Search');
    expect(data.itemListElement[1].item).toBe('https://paprikaa.netlify.app/search');
  });
});
