import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { PimPage } from '../pages/PimPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { EmployeeProfilePage } from '../pages/EmployeeProfilePage';

test.describe('Add Employee', () => {
  test('Add a new employee and verify the employee profile is displayed', async ({ page }) => {
    const firstName = 'John123';
    const lastName = 'Doe456';

    // 1. Navigate to the application
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();

    // 2. Login with valid credentials
    await loginPage.login('Admin', 'admin123');

    // 3. Navigate to the PIM module
    const homePage = new HomePage(page);
    await homePage.goToPimModule();

    // 4. Click on "Add Employee"
    const pimPage = new PimPage(page);
    await pimPage.goToAddEmployee();

    // 5-7. Enter first/last name and click Save
    const addEmployeePage = new AddEmployeePage(page);
    await addEmployeePage.addEmployee(firstName, lastName);

    // 8. Verify the employee profile page is displayed
    const employeeProfilePage = new EmployeeProfilePage(page);
    await expect(employeeProfilePage.personalDetailsHeading).toBeVisible({
      timeout: 15000,
    });
    await expect(page).toHaveURL(/\/web\/index\.php\/pim\/viewPersonalDetails/);

    // 9. Verify the full name is visible on the profile
    await expect(employeeProfilePage.employeeNameHeading(firstName, lastName)).toBeVisible();
  });
});