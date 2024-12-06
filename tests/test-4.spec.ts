import { test, expect } from '@playwright/test'

//These hooks apply to all tests in this file
test.beforeAll(()=>{
    console.log('Runs before any tests in this file execute');
    
});

test.beforeEach(async ({page})=>{
    console.log('Runs before each and every test');
    await page.goto('https://www.google.com');
});

test.afterEach(()=>{
    console.log('Runs after each and every test');
});

test.afterAll(()=>{
    console.log('Runs once at teh end after all tests have finished');
});


test.describe('A test suite', () => {
    test.beforeEach(()=>{
        console.log('Runs before each and every test in this test describe block');
    });
    test.describe.configure({ retries: 2,mode: 'serial', timeout: 15000 }); //Tests in this describe get 2 retries,opt out of parallel, and have 15s to finish

    test('Capturing values',{tag:['@thisisatag','@thistoo']}, async ({ page }) => {

        await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");

        let rightColText = await page.locator('#right-column').textContent(); //Includes whitespace in HTML file

        console.log("The right column text is with textContent is: " + rightColText);

        rightColText = await page.locator('#right-column').innerText(); //Captures text after browser layout has happened (eliminating most whitespace)

        console.log("The right column text is with innertext is: " + rightColText);

        await page.pause();

        await page.locator('#textInput').fill('Hello world');
        let textBoxText: string = await page.locator('#textInput').textContent() ?? ""; //TS: if textContent() returns null, retuen empty string "" instead
        console.log("The text box contains" + textBoxText); //blank as <input> has no inner text

        //Using generic $eval to get the browser to return the INPUT text
        //This will *not* retry or wait
        textBoxText = await page.$eval('#textInput', (el: HTMLInputElement) => el.value); //el is an in browser HTML element - not a Playwright object at all.
        console.log("The text box actually contains: " + textBoxText);

        // await page.$eval('#textInput', elm => {
        //     console.log(typeof(elm))
        // });

        expect(textBoxText).toBe("Hello world");

    });

    test.describe.serial('An inner suite',() => { //Alternative way to mark a describe for serial execution
        test.setTimeout(10000); //Tests in this describe block only get 10s total to execute
        test.use({actionTimeout: 9000}) //Tests in this desribe block get 9s action timeouts
        
        //ToDo: set tests to execute serially
        test("Generic methods", async ({ page }) => {
            
            await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html")

            const menuLinks = await page.$$eval('#menu a', (links) => links.map((link) => link.textContent))
            console.log(`There are ${menuLinks.length} links`)

            console.log("The link texts are:")

            for (const iterator of menuLinks) {
                console.log(iterator?.trim())
            }

            //Preferred - using retry-able Playwright locators
            const preferredLinks = await page.locator('#menu a').all();
            for (const elm of preferredLinks) {
                // const elmtext = await elm.textContent();
                // const elmtexttrimmed = elmtext?.trim();
                console.log(`${await elm.textContent().then(text => { return text?.trim() })}`)
            }
        })

        test('waiting', async ({ page }) => {
            
            page.setDefaultTimeout(7000); //Set action timeout for all actions in this test
            await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
            await page.getByRole('link', { name: 'Access Basic Examples Area' }).click();
            await page.getByRole('link', { name: 'Dynamic Content' }).click();
            await page.locator('#delay').click();
            await page.locator('#delay').fill('10');
            await page.getByRole('link', { name: 'Load Content' }).click();
            //await page.locator('#image-holder > img').click({timeout: 8000}); //Set action timeout locally for just this step
            //await page.waitForSelector('#image-holder > img', {timeout: 12000, state:'visible'})
            await page.waitForSelector('#spinner-holder', { timeout: 12000, state: 'hidden' }) //Wait for loading spinner to go away
            await page.locator('#image-holder > img').click();
            await page.getByRole('link', { name: 'Home' }).click();
        });
    })

})


test("Waiting for a pop up window", async ({ page, context }) => {
    await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/dynamicContent.html")

    const [newPage] = await Promise.all([ //When these two "future" actions complete return the new page fixture
        context.waitForEvent('page'),
        page.locator("#right-column > a[onclick='return popUpWindow();']").click()
    ])



    await page.waitForTimeout(2000); //Thread.sleep(2000);


    const closeBtn = newPage.getByRole('link', { name: 'Close Window' }); //closes the newly opened popup //Not working in Firefox?
    await closeBtn.click();

    await page.getByRole('link', { name: 'Load Content' }).click();

})
