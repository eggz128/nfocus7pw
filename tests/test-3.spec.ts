import { test, expect } from '@playwright/test';

test('actions', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Access Basic Examples Area' }).click();
  await page.getByRole('link', { name: 'Forms' }).click();
  await page.locator('#textInput').click({button: "left",modifiers: ['Shift'], position: {x: 10, y:10}});
  //await page.locator('#doesnotexist').click({timeout: 5000}); //By default actions dont have a timeout - they have whatever time the test has to complete (30s by default)
  await page.locator('#textInput').pressSequentially('Steve');
  await page.locator('#textInput').pressSequentially(' Powell', {delay: 1000}); //Doesn't clear text that is already there (unlike fill) and can simulate slow keypresses 

  //Image based validation
  await expect(page.locator('#textInput')).toHaveScreenshot('textbox.png',{
    maxDiffPixelRatio: 0.8
  });


  await page.locator('#textArea').click();
  await page.locator('#textArea').clear();
  await page.locator('#textArea').fill('was\nhere');
  await page.locator('#textArea').clear();
  await page.locator('#checkbox').click(); //Toggle on/off state
  await page.locator('#checkbox').uncheck(); //Set state
  await page.locator('#checkbox').check();
  await page.locator('#select').selectOption('Selection Two');

  //Check there are 3 radio buttons
  //await expect(page.locator('input[type=radio]')).toHaveCount(2, {timeout: 7000});
  const slowExpect = expect.configure({timeout: 9000})
  //Fails as there are 3 radio buttons (also fails at a 'slow' 9 seconds)
  //await slowExpect.soft(page.locator('input[type=radio]')).toHaveCount(2);
 
  

  await page.locator('#two').check();
  await page.getByRole('link', { name: 'Submit' }).click();
});

test('drag drop slider', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/cssXPath.html')

  await page.locator('#apple').scrollIntoViewIfNeeded();
  //Dragging 'outside' of an element normally fails due to 'actionability' checks. force:true tells Playwright just to do the action skipping any checks.
  //await page.dragAndDrop('#slider a', '#slider a', {targetPosition: {x: 100, y:0}, force: true}) //While this moves the gripper it wont change the size of the apple - this is due to the JS on the page that does the resizing not firing properly for large movements

  //So instead do lots of little jumps. Just make sure that you 'jump' far enough to get 'outside' the gripper each time
  await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
  await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
  await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
  await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
  //We should probably write a custom function for this 'lots of little jumps' drag and drop...
  //await smoothDrag(page, '#slider a', 200, 5);

})

test("compare runtime images", async ({page, browserName}, testInfo)=>{
  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");

  await page.locator('#textInput').fill("Hello World"); //Set intial state
  
  //ToDo: capture screenshot of text box in memory
  //Capture in mem is easy - doing the expect on it after, not so much as PlayWright expect .toMatchSnapshot() expects the screenshot to be on disk
  //See https://github.com/microsoft/playwright/issues/18937

  //const originalimage = await page.locator('#textInput').screenshot();
  //originalimage is now a buffer object with the screenshot. You could use a 3rd party js lib to do the comparison... but if we're sticking to Playwright only...

  //await expect(page.locator('#textInput')).toHaveScreenshot('textbox')
  //No good as PW wants to capture the screenshot on the first run and use that screenshot for following runs. We want to capture and use on this run. So...

  await page.locator('#textInput').screenshot({path: `${testInfo.snapshotDir}/textbox2-${browserName}-${testInfo.snapshotSuffix}.png`})
  //screenshots will need to vary by browser and OS, and be saved in to the test snapshot directory for .toMatchSnapshot() to find them

  
  //Change element text
  await page.locator('#textInput').fill("Hello world"); //Alter the state (right now this is the same as initially set so following expect *should* pass)
                                                          //change to e.g. "Hello world"

  //Recapture screenshot, compare to previous (on disk) version.
  expect(await page.locator('#textInput').screenshot()).toMatchSnapshot('textbox2.png')

  //Now go look at the html report
});

