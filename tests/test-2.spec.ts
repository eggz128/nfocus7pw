import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  //await page.getByRole('searchbox', { name: 'Search for:' }).click();
  await page.getByPlaceholder('Search products…').nth(0).click(); //PW when performing an action needs to act on only one element. Initial search found 2 matches, filtered to 1st match.
  await page.getByRole('searchbox', { name: 'search for:',/* exact: true */ }).fill('cap');
  await page.getByRole('searchbox', { name: /Search.*/ }).press('Enter');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  //await page.locator('css=#content').getByRole('link', { name: 'View cart ' }).click();
  const contentElm = page.locator('css=#content'); //PW doesn't look for this elm now - only when an action is performed (unlike WD)
  const linkElm = contentElm.getByRole('link', { name: 'View cart ' });
  await linkElm.click(); //Action needed - PW finds all elemets required at this point.
  
  //await page.getByTestId('asdf') //finds the below
  //<div data-testid="asdf" data-cy="asdf">
  
  //Cypress you can't use variables to store elm references like above
  //You would have to do something like this:
  //cy.get('#content').then(elm => {
  // cy.get('#someotherelm').then(elm2 =>{
  // elm and elm2 in scope here
  //  })
  //})

  //await page.locator('//*[@id="content"]').getByRole('link', { name: 'View cart ' }).click();
  await page.getByLabel('Remove this item').click();
  await page.getByRole('link', { name: 'Return to shop' }).click();
  await page.locator('#menu-item-42').getByRole('link', { name: 'Home' }).click();
});

test('test2', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  await page.getByRole('searchbox', { name: 'Search for:' }).click();
  await page.getByRole('searchbox', { name: 'Search for:' }).fill('cap');
  await page.getByRole('searchbox', { name: 'Search for:' }).press('Enter');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
  await page.getByLabel('Remove this item').click();
  await page.getByRole('link', { name: 'Return to shop' }).click();
  await page.locator('#menu-item-42').getByRole('link', { name: 'Home' }).click();
});

test('all products', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  const newProducts = await page.getByLabel('Recent Products');
  for (const prod of await newProducts.locator('h2:not(.section-title)').all()) { //gathers a collection of all() matching elements
    console.log(await prod.textContent()); //then loops over each individual match logging the text
  };
  
});

test('Locator Handler', async ({ page }) => {
  // Setup the handler.
  const cookieConsent = page.getByRole('heading', { name: 'Hej! You are in control of your cookies.' });
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

  // Now write the test as usual. If at any time the cookie consent form is shown it will be accepted.
  await page.goto('https://www.ikea.com/');
  await page.getByRole('link', { name: 'Collection of blue and white' }).click();
  await expect(page.getByRole('heading', { name: 'Light and easy' })).toBeVisible();

  //If you're confident the locator will no longer be found you can de-register the handler
  //await page.removeLocatorHandler(cookieConsent);
  //If the cookie consent form appears from here on it may cause issues with the test...
  await page.waitForTimeout(5000);
})


