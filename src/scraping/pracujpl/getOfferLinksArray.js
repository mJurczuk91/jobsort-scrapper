import puppeteer from 'puppeteer';
import skipCookies from './skipCookies.js';
import skipPopup from './skipPopup.js';

export default async function getOfferLinksArray(url) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto(mainUrl, {
        waitUntil: "domcontentloaded",
    });
    
    await skipPopup(page);
    await skipCookies(page);

    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });

    const offerLinksArray = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-test="link-offer"]'))
            .map(href => {
                const [link,] = href.getAttribute('href').split('?');
                return link;
            });
    });

    await browser.close();
    return offerLinksArray;
}

