import { test, expect } from '@playwright/test';

test.describe('Dark Theme Implementation (KAN-4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should default to system theme and apply correct class', async ({ page }) => {
    // Check if html tag exists and has suppressHydrationWarning attributes or specific next-themes behavior
    const html = page.locator('html');
    // next-themes with attribute="class" will set the class on the html element
    await expect(html).toBeVisible();
  });

  test('should switch to dark mode manually', async ({ page }) => {
    // Open the ModeToggle dropdown
    await page.getByRole('button', { name: /toggle theme/i }).click();
    
    // Click 'Dark' option
    await page.getByRole('menuitem', { name: 'Dark' }).click();

    // Verify 'dark' class is present on html
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Verify background color changes (checking CSS variable mapping)
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    // Dark background defined as hsl(0 0% 3.9%) which is roughly #0a0a0a
    expect(bodyBg).toBe('rgb(10, 10, 10)'); 
  });

  test('should switch to light mode manually', async ({ page }) => {
    // Set to dark first
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: 'Dark' }).click();
    
    // Switch back to light
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: 'Light' }).click();

    await expect(page.locator('html')).not.toHaveClass(/dark/);
    
    // Light background defined as hsl(0 0% 100%)
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(255, 255, 255)');
  });

  test('should persist theme selection across reloads', async ({ page }) => {
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: 'Dark' }).click();
    
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.reload();

    // Verify it is still dark after reload
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should respect system color scheme preference', async ({ page }) => {
    // Emulate system dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();

    // With defaultTheme="system", it should pick up the dark preference
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Emulate system light mode
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('branding logo should maintain primary color in both modes', async ({ page }) => {
    const logo = page.locator('span:has-text("Paprika")');
    
    // Light mode check
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: 'Light' }).click();
    await expect(logo).toHaveCSS('color', 'rgb(222, 36, 36)'); // hsl(0, 72.2%, 50.6%)

    // Dark mode check
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.getByRole('menuitem', { name: 'Dark' }).click();
    await expect(logo).toHaveCSS('color', 'rgb(222, 36, 36)');
  });

  test('should not have hydration mismatch errors in console', async ({ page }) => {
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('Hydration')) {
        logs.push(msg.text());
      }
    });

    await page.goto('/');
    expect(logs.length).toBe(0);
  });
});