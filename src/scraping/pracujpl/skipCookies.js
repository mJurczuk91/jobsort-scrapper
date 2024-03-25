export default async function skipCookies(page) {
    const cookieButtonSelector = '[data-test="button-submitCookie"]';

    const cookieButton = !!await page.$(cookieButtonSelector);

    if (cookieButton) {
        await page.click(cookieButtonSelector, {
            waitUntil: 'domcontentloaded'
        });
    }
}