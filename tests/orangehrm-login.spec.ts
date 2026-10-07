import { test, expect } from '@playwright/test';

test.describe('OrangeHRM Login', () => {
  test('Login with valid credentials and verify dashboard is displayed', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Verify login page is displayed
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    // Enter username
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');

    // Enter password
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');

    // Click on Login button
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify dashboard page is displayed (URL + heading)
    await expect(page).toHaveURL(/\/web\/index.php\/dashboard\/index/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});