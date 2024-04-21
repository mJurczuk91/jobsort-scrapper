import { delay } from "../../lib.js";

export default async function skipCookies(page) {
    const cookieButtonSelector = '[data-test="button-submitCookie"]';
    await delay(1000);
    const cookieButton = !!await page.$(cookieButtonSelector);

    if (cookieButton) {
        await page.click(cookieButtonSelector, {
            waitUntil: 'domcontentloaded'
        });
    }
}