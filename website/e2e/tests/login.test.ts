import { test, expect, Page } from '@playwright/test'
import { prisma } from 'prisma-client'
import { sleep } from '../playwright.config'
import '../../global'

test.describe.serial('new user gets a new org', () => {
    test.setTimeout(1000 * 60 * 5)
    const email = new Date().getTime() + '@gmail.com'
    const name = new Date().getTime() + ' Name'
    test.beforeAll(async () => {
        await prisma.orgsUsers.deleteMany({
            where: { user: { email } },
        })
        await prisma.org.deleteMany({
            where: { users: { some: { user: { email } } } },
        })
        await prisma.user.deleteMany({ where: { email } })
    })
    test('login creates an user and org', async ({ page }) => {
        await page.goto('/empty')

        await page.waitForFunction(() => window.loginForTests)

        await page.evaluate(
            ([name, email]) => {
                return window.loginForTests({ name, email })
            },
            [name, email],
        )

        expect(
            await prisma.user.findFirst({
                where: { email: email },
            }),
        ).toBeTruthy()
        expect(
            await prisma.org.findFirst({
                where: { users: { some: { user: { email: email } } } },
            }),
        ).toBeTruthy()
        await page.goto('/dashboard')
        await expect(page.locator('[aria-label="current org"]')).toHaveText(
            name,
        )
    })
})
