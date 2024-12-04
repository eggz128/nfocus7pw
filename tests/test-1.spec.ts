import { test, expect } from '@playwright/test';

test('LoginLogoutTest', async ({ page }) => {
  
  /*
  *Arrange - get the AUT in to a state ready to test
  */

  //WD C# Equiv - driver.URL = "https://www.edgewordstraining.co.uk/webdriver2/";
  //Cypress eqivalent
  //cy.visit('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');

  //Follow WebDriver's pattern
  //<tool>.<findsomething>.<dosomethingwithit>
  //WD: driver.FindElement(By.LinkText("Login To Restricted Area")).Click();
  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();

  //Chaining locators works for Playwright as it does in WebDriver (and Cypress...)
  //The below finds a table row, then looks for an element inside with an id of username, before clicking that elm
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
  
  /*
  *Act - do the login/logout
  */
  await page.locator('#password').click();

  //WD equivalent
  //driver.FindElement(By.CSS("#password")).Clear();
  //driver.FindElement(By.CSS("#password")).SendKeys("edgewords123"); //WD wont exisitng text PW's .fill() will
  //Cypress equivalent
  //cy.get('#password').clear();
  //cy.get('#password').type('edgewords'); //Cypress type() is like WD SendKeys() - it down't clear any existing text - only appends to it.

  await page.locator('#password').fill('edgewords123');
  //await page.fill('#password','edgewords123') //Old Playwright pattern - do not use (but still works)

  await page.getByRole('link', { name: 'Submit' }).click();
  await expect(page.locator('h1')).toContainText('Add A Record To the Database');
  //Need to click JS Alert OK to actually log out
  //Before clicking "Log Out" link, set up a listener that can intercept alert and handle it
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.accept();
  });
  await page.getByRole('link', { name: 'Log Out' }).click(); //Spawns alert. Event listener will handle
  //WD Equivalent: driver.SwitchTo().Alert().Accept() //Note in WD you would handle the alert at *after* it spawned. In PW/Cypress you set up handling *before* it spawns.
  
  /*
  *Assert - did Login/Logout work?
  */
  
  //Assertion doesn't capture value to test - instead acts on locator
  //This means the assertion can retry if it doesn't get what it wants on the first attempt
  await expect(page.locator('h1')).toContainText('Access and Authentication'); //Will retry for 5s
});