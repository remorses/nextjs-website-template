import { test, expect, Page } from '@playwright/test'
import { prisma } from 'prisma-client'
import { testData, sleep } from '../playwright.config'
import '../../global'

// use already logged in user
test.use({ storageState: testData.storageState })
test.describe.serial('dashboard', () => {
    test.setTimeout(1000 * 60 * 5)

    let campName = 'camp' + Date.now()
    let campaignId
    test('create a campaign', async ({ page }) => {
        await page.goto('/dashboard')
        await page.click(`[aria-label='new campaign']`)
        await page.fill(`[aria-label='campaign name']`, campName)
        await Promise.all([
            // page.waitForNavigation(),
            page.click(`button[type='submit']`),
        ])
        // await expect(page.locator(`a:has-text("${campName}")`)).toBeVisible()
    })
    test('campaign page exists', async ({ page }) => {
        await page.goto('/dashboard')
        const link = await page.waitForSelector(
            `a:has-text("${campName}"):visible`,
        )
        await Promise.all([link.click(), page.waitForNavigation()])
        campaignId = page.url().split('/').pop()
        // await page.pause()
    })

    test('show tweets in inbox', async ({ page }) => {
        await prisma.scrapedTweet.createMany({
            data: ['1482385442460819457', '1465082577765613569'].map(
                (tweetId) => ({
                    tweetId,
                    campaignId,
                }),
            ),
        })
        await page.goto(`/dashboard/campaign/${campaignId}`)
        await page.pause()
    })
})
