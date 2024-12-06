import { test, expect } from '@playwright/test';
import { HomePOM } from './POMClasses/HomePOM';
import { LoginPOM } from './POMClasses/LoginPOM';
import { AddRecordPOM } from './POMClasses/AddRecordPOM';

test('Non POM Traditional', async ({ page }) => {

  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/')
  await page.getByText('Login').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');
  await page.getByRole('link', { name: 'Submit' }).click();
  await expect(page.locator('h1')).toContainText('Add A Record To the Database');
});

test('Pomified', async ({page})=>{
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');

  const home = new HomePOM(page);
  await home.goLogin();

  const loginpage = new LoginPOM(page);
  
  await loginpage.doLogin('edgewords','edgewords123');

  const addRecordPage = new AddRecordPOM(page);
  await expect(addRecordPage.heading).toHaveText('Add A Record To the Database');
});