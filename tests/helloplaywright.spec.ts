import { test, expect } from '@playwright/test'; //Kindof equivalent to C# using

test('My First Test', async ({page})=>{
    await page.goto("http://www.google.com/");
    await page.getByRole('button', { name: 'Accept all' }).click();
    await page.getByLabel('Search', { exact: true }).click();
    await page.getByLabel('Search', { exact: true }).fill('edgwords');
    await page.getByLabel('Google Search').first().click();
    await expect(page.locator('#rso')).toContainText('Edgewords Training - Automated Software Testing Training');
    //await page.close();
});
