import { test as base } from '@playwright/test'

export type TestOptions = {
    siteusername: string
}

export const test = base.extend<TestOptions>({
    siteusername: ['webdriver', { option: true}] //ToDo: What does this option property do exactly?
})



