import skipCookies from './skipCookies.js';
import skipPopup from './skipPopup.js';
import { delay } from '../../lib.js';

export default async function getOfferLinksArray(browser, url) {

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });
    await skipPopup(page);
    await skipCookies(page);

    const offerLinksArray = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-test="link-offer"]'))
            .map(href => {
                const [link,] = href.getAttribute('href').split('?');
                return link;
            });
    });
    
    return offerLinksArray;
}

