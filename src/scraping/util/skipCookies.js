export default async function skipCookies(page, cookieButtonSelector) {
    const cookieButton = !!await page.$(cookieButtonSelector);

    if (cookieButton) {
        await page.click(cookieButtonSelector, {
            waitUntil: 'domcontentoaded',
        });
    }
}