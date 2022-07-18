import { PlaywrightTestConfig } from '@playwright/test'

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
        baseURL: 'http://localhost:7050',
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
