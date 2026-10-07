import { type Page, type Locator } from '@playwright/test';

export class PimPage {
  readonly page: Page;
  readonly addEmployeeLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addEmployeeLink = page.getByRole('link', { name: 'Add Employee' });
  }

  async goToAddEmployee(): Promise<void> {
    await this.addEmployeeLink.click();
    await this.page.waitForURL(/\/web\/index\.php\/pim\/addEmployee/);
  }
}