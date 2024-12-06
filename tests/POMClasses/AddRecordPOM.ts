import {Page, Locator} from '@playwright/test'

export class AddRecordPOM {

    //Fields
    page: Page
    heading: Locator

    constructor(page: Page){
        this.page = page;

        //Locators
        this.heading = page.locator('h1')
    }

    //Service methods
    

}