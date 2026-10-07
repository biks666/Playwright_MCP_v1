import { test, expect } from '@playwright/test';

test.describe('OrangeHRM Logout', () => {
  test('Login, logout, and verify login page is displayed', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Login with valid credentials
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify dashboard is displayed before logging out
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Click on the user profile icon in the top-right corner
    await page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();

    // Click on "Logout"
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    // Verify login page is displayed (URL + heading)
    await expect(page).toHaveURL(/\/web\/index.php\/auth\/login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    // Verify the page contains "Username" field
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  });
});