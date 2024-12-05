import { test, expect } from '@playwright/test'; //Kindof equivalent to C# using

test('My First Test', async ({page})=>{
    //Cookie consent form doesnt seem to appear when running in GitHub CI
    //Use handler to accept cookies only if it appears
    // Setup the handler.
  const cookieConsent = page.getByRole('button', { name: 'Accept all' });
  await page.addLocatorHandler(
    cookieConsent, //Locator to watch out for
    async () => { //If spotted, what to do
      await page.getByRole('button', { name: 'Accept all' }).click();
    }
    , //Optional arguments - can be omitted
    {
      times: 10, //How many times the locator may appear before the handler should stop handling the locator
      //By default Playwright will wait for the locator to no longer be visible before continuing with the test.
      noWaitAfter: true //this can be overridden however
    }
  );

    await page.goto("http://www.google.com/");
    //await page.getByRole('button', { name: 'Accept all' }).click(); //Not there when running on CI?
    await page.getByLabel('Search', { exact: true }).click();
    await page.getByLabel('Search', { exact: true }).fill('edgewords');
    await page.getByLabel('Google Search').first().click();
    await expect(page.locator('#rso')).toContainText('Edgewords Training - Automated Software Testing Training');
    //await page.close();
});
