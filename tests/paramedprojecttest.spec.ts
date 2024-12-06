import { test } from './my-test'

import { expect } from '@playwright/test';
import { HomePOM } from './POMClasses/HomePOM';
import { LoginPOM } from './POMClasses/LoginPOM';
import { AddRecordPOM } from './POMClasses/AddRecordPOM';

test(`Paramed Project example`, async ({page, siteusername})=>{
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  
    const home = new HomePOM(page);
    await home.goLogin();
  
    const loginpage = new LoginPOM(page);
    
    await loginpage.doLogin(siteusername, "edgewords123");
  
    const addRecordPage = new AddRecordPOM(page);
    await expect(addRecordPage.heading).toHaveText('Add A Record To the Database');
  });