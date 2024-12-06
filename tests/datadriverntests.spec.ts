import { test, expect } from '@playwright/test';
import { HomePOM } from './POMClasses/HomePOM';
import { LoginPOM } from './POMClasses/LoginPOM';
import logins from './data/logins.json' //Only valid in TS
import { AddRecordPOM } from './POMClasses/AddRecordPOM';


for(let credentials of logins){

    test(`Data driven for username ${credentials.username}`, async ({page})=>{
        await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
      
        const home = new HomePOM(page);
        await home.goLogin();
      
        const loginpage = new LoginPOM(page);
        
        await loginpage.doLogin(credentials.username, credentials.password);

        const addRecordPage = new AddRecordPOM(page);
        await expect(addRecordPage.heading).toHaveText('Add A Record To the Database');
      });
}

