import skipCookies from "../util/skipCookies.js";
import { delay } from "../../lib.js";

export default async function searchResultsParser(page) {
    
    const urlsToEvaluate = !!await page.$('[Aria-label="Paginacja"]')
        ? await page.evaluate(() => {
            return (
                Array.from(document.querySelectorAll('[data-test="anchor-pageNumber"]'))
                .map(pageNumber => pageNumber.href)
            )})
        : [url]

    const offerLinksArray = [];
    for (let link of urlsToEvaluate) {
        if (page.url() !== link) {
            await page.goto(link, {
                waitUntil: "domcontentloaded"
            });
            await delay(4000);
        }

        const partialLinks = await page.$$eval(
            '[data-test="list-item-offer"]',
            array => array.map(
                a => a.href
            ),
        )
        offerLinksArray.push(...partialLinks);
    }

    return offerLinksArray;
}