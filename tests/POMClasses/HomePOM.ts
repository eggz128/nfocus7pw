import {Page, Locator} from '@playwright/test'

export class HomePOM {

    //Fields
    page: Page
    loginLink: Locator

    constructor(page: Page){
        this.page = page;

        //Locators
        this.loginLink = page.getByText('Login')
    }

    //Service methods
    async goLogin() {await this.loginLink.click()}

}