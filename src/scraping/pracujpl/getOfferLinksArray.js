import puppeteer from 'puppeteer';
import skipCookies from './skipCookies.js';
import skipPopup from './skipPopup.js';
import { delay } from '../../lib.js';

export default async function getOfferLinksArray(browser, url) {

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });
    await delay(2000);
    await skipPopup(page);
    await delay(2000);
    await skipCookies(page);

    await delay(1000);

    const offerLinksArray = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-test="link-offer"]'))
            .map(href => {
                const [link,] = href.getAttribute('href').split('?');
                return link;
            });
    });
    console.log(offerLinksArray);

    return offerLinksArray;
}

