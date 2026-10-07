import { type Page, type Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly pimModuleLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pimModuleLink = page.getByRole('link', { name: 'PIM' });
  }

  async goToPimModule(): Promise<void> {
    await this.pimModuleLink.click();
    await this.page.waitForURL(/\/web\/index\.php\/pim\/viewEmployeeList/);
  }
}