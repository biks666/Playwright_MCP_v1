import { type Page, type Locator } from '@playwright/test';

export class EmployeeProfilePage {
  readonly page: Page;
  readonly personalDetailsHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
  }

  employeeNameHeading(firstName: string, lastName: string): Locator {
    return this.page.getByRole('heading', { name: `${firstName} ${lastName}` });
  }
}