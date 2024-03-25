export default async function skipCookies(page) {
    const cookieButtonSelector = '[data-test="button-submitCookie"]';

    const cookieButton = await page.evaluate(() => {
        return document.querySelector('[data-test="button-submitCookie"]');
    });

    if (cookieButton) {
        await page.click(cookieButtonSelector, {
            waitUntil: 'domcontentloaded'
        });
    }
}