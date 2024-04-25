export default async function skipCookies(page, cookieButtonSelector) {
    await delay(1000);
    const cookieButton = !!await page.$(cookieButtonSelector);
    
    if (cookieButton) {
        await page.click(cookieButtonSelector, {
            waitUntil: 'domcontentoaded',
        });
    }

    await delay(2000);
}