import { PlaywrightTestConfig } from '@playwright/test'

export const testData = {
    ROOT_URL: 'http://localhost:7050',
    NAME: 'MY NAME',

    EMAIL: 'myemail@gmail.com',
    storageState: 'storageState.json',
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const config: PlaywrightTestConfig = {
    globalSetup: require.resolve('./global-setup'),
    
    outputDir: 'output',
    use: {
        browserName: 'chromium',
        headless: !Boolean(process.env.HEADED),

        screenshot: 'only-on-failure',
        baseURL: testData.ROOT_URL,
        launchOptions: {
            // slowMo: 50,
        },
        contextOptions: {
            strictSelectors: false,
            reducedMotion: 'reduce',
        },
    },
    workers: 1,
    // retries: 0,
}
export default config
