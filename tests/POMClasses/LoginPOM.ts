import {Page, Locator} from '@playwright/test'

export class LoginPOM {

    //Fields
    page: Page
    private usernameField: Locator //private field - valid in TS only
    #passwordField: Locator //private field - valid in JS and TS
    submitButton: Locator

    constructor(page: Page){
        this.page = page;

        //Locators
        this.usernameField = page.getByRole('row', { name: 'User Name?' }).locator('#username');
        this.#passwordField = page.locator('#password'); 
        this.submitButton = page.getByRole('link', { name: 'Submit' });
    }

    //Service methods
    async setUsername(username: string) {await this.usernameField.fill(username) }
    async setPassword(password: string) {await this.#passwordField.fill(password) }
    async submitForm() {await this.submitButton.click() }

    async doLogin(username: string, password: string) {
        await this.setUsername(username);
        await this.setPassword(password);
        await this.submitForm();
    }

}