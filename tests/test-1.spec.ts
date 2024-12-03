import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  //WD C# Equiv - driver.URL = "https://www.edgewordstraining.co.uk/webdriver2/";
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
  await page.locator('#password').click();
  //WD equiv
  //driver.FindElement(By.CSS("#password")).Clear();
  //driver.FindElement(By.CSS("#password")).SendKeys("edgewords123");
  //Cypress eq
  //cy.get('#password').type('edgewords'); //Steve scheck this
  //await page.fill('#password','edgewords123') //Old Playwright pattern - do not use (but still works)
  await page.locator('#password').fill('edgewords123');
  await page.getByRole('link', { name: 'Submit' }).click();
  await expect(page.locator('h1')).toContainText('Add A Record To the Database');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.accept();
  });
  await page.getByRole('link', { name: 'Log Out' }).click();
  await expect(page.locator('h1')).toContainText('Access and Authentication');
});