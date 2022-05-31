import { testData } from './playwright.config'
import { chromium, FullConfig } from '@playwright/test'
import '../global'

async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch()
    const page = await browser.newPage({
        reducedMotion: 'reduce',
        strictSelectors: false,
    })
    await page.goto(new URL('/empty', testData.ROOT_URL).toString())
    await page.waitForFunction(() => window.loginForTests)

    await page.evaluate(
        ([name, email]) => {
            return window.loginForTests({ name, email })
        },
        [testData.NAME, testData.EMAIL],
    )
    // Save signed-in state to 'storageState.json'.
    await page.context().storageState({ path: testData.storageState })
    await browser.close()
}

export default globalSetup
