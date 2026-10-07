import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Test data model matching the columns of test_data/loginData.csv
 */
interface LoginData {
  Username: string;
  Password: string;
  Expected: string;
}

/**
 * Load and parse the CSV test data once at module level.
 * csv-parse is used with `columns: true` to map header row -> object keys.
 */
const csvFilePath = path.resolve(__dirname, '..', 'test_data', 'loginData.csv');
const csvContent = fs.readFileSync(csvFilePath, 'utf8');

const records: LoginData[] = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

test.describe('Login validation (data-driven from CSV)', () => {
  /**
   * Requirement #3: iterate over ALL rows in the dataset automatically.
   * Each CSV row generates its own atomic, independent test case.
   */
  for (const record of records) {
    test(`Login with "${record.Username}" - Expected: ${record.Expected}`, async ({
      page,
    }) => {
      // Requirement #4: log the dataset entry being executed
      console.log(
        `Running: Username="${record.Username}", Password="${record.Password}", Expected="${record.Expected}"`
      );

      // Navigate to the OrangeHRM login page
      await page.goto(
        'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
      );

      // Enter Username and Password from the dataset
      await page.getByRole('textbox', { name: 'username' }).fill(record.Username);
      await page.getByRole('textbox', { name: 'password' }).fill(record.Password);

      // Click the Login button
      await page.getByRole('button', { name: 'Login' }).click();

      // Verify the Expected result for this dataset entry
      if (record.Expected === 'Dashboard') {
        // Successful login -> dashboard page is displayed
        await expect(page).toHaveURL(/\/web\/index\.php\/dashboard\/index/);
        await expect(
          page.getByRole('heading', { name: 'Dashboard' })
        ).toBeVisible();
        console.log(`PASS: Login successful for "${record.Username}"`);
      } else if (record.Expected === 'Invalid credentials') {
        // Failed login -> error message is displayed
        const errorAlert = page.getByRole('alert');
        await expect(errorAlert).toBeVisible();
        await expect(errorAlert).toContainText('Invalid credentials');
        console.log(`PASS: Invalid credentials shown for "${record.Username}"`);
      } else {
        throw new Error(`Unexpected Expected value in dataset: "${record.Expected}"`);
      }
    });
  }

  /**
   * Requirement #5: close the browser after all tests complete.
   * Note: Playwright's test runner also closes the browser automatically
   * when a worker finishes; this explicit close guards the teardown.
   */
  test.afterAll(async ({ browser }) => {
    if (browser.isConnected()) {
      await browser.close();
      console.log('Browser closed after all tests completed.');
    }
  });
});