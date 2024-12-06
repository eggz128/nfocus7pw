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

test('Screenshot demo', async ({page, browserName})=>{
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/basicHtml.html')
  await page.screenshot({path: './manualscreenshots/page-screenshot.png'});
  await page.screenshot({path: './manualscreenshots/whole-page-screenshot.png', fullPage: true});
  await page.locator('#htmlTable').screenshot({path: './manualscreenshots/htmltable.png', 
    mask: [page.locator('#TableVal2')],
    maskColor: 'rgba(214, 21, 179,0.5)', //default mask colour is magenta #FF00FF
    style: `#htmlTable tr:nth-child(3) {border: 10px solid red}
            table#htmlTable {border-collapse: collapse}
    ` //HTML table rows cannot have a border unless the table's border collapse model is set to collapse
  })
  if(browserName=='chromium'){ //Firefox and WebKit cant make pdf's (in PW)
    await page.pdf({path: './manualscreenshots/printed.pdf'})
  }
  

})

test('Reporting demos',{annotation: {type: 'Some custom type', description: 'Some description'}} ,async ({page}, testInfo)=>{
  
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/basicHtml.html')
  await page.screenshot({path: './manualscreenshots/page-screenshot.png'});
  await testInfo.attach('Viewpoert screenshot', {path: './manualscreenshots/page-screenshot.png'})
  console.log('Attached screenshot to report');


  await testInfo.attach('Some text to attach', {
    contentType: 'text/plain',
    body: 'This is the attached text'
  })

  const screenshot = await page.screenshot({path: './manualscreenshots/whole-page-screenshot.png', fullPage: true});
  await testInfo.attach('Screenshot stored in memory', {
    contentType: 'image/png',
    body: screenshot
  });
})