import puppeteer from "puppeteer";
import scrapeOfferLinks from "../util/parseOfferUrlRepository.js";
import searchResultsParser from './searchResultsParser.js'
import skipCookies from "../util/skipCookies.js";
import parseOfferLinkArray from "../util/parseOfferUrlArray.js";
import offerParser from "./offerParser.js";
import { delay } from "../../lib.js";

const searchLinks = [
    'https://theprotocol.it/filtry/javascript,node.js,react.js,typescript;t/junior,trainee,assistant;p',
]

const techLookedFor = [
    'javascript',
    'typescript',
    'node',
    'react',
    'script',
]

const offer = 'https://theprotocol.it/szczegoly/praca/frontend---javascript---typescript-developer-bialystok-aleja-jozefa-pilsudskiego-6-1,oferta,21ff0000-3214-86a3-5818-08dc645e2547?s=5358332323&searchId=fae0f2d0-03a8-11ef-b992-030a8d77b7f7'

export default async function scrapeTheprotocol() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto('https://theprotocol.it', {
        waitUntil: "domcontentloaded",
    });
    await skipCookies(page, '[data-test="button-acceptAll"]');
    
    const searchLinksPages = await getPagination(page, searchLinks);
    const offerLinks = await scrapeOfferLinks(
        page,
        searchLinksPages,
        searchResultsParser,
    );

    if (offerLinks.length === 0) {
        await page.close();
        await browser.close();
        logError('no offers found in parsepracujpl');
        return [];
    }
    const parsedOffers = await parseOfferLinkArray(offerLinks, 'www.theprotocol.it', techLookedFor, page, offerParser);
    await page.close();
    await browser.close();
    return parsedOffers;
}

async function getPagination(page, searchLinks) {
    const result = [];

    for (let link of searchLinks) {
        await page.goto(link);
        await delay(3000);

        try {
            await page.$eval(
                '[data-test="anchor-pageNumber"]',
                element => element.href,
            )
        }
        catch (e) {
            return [link];
        }

        const pages = await page.$$eval(
            '[data-test="anchor-pageNumber"]',
            (array) => array.map((pageNumber) => {
                return pageNumber.href
            }),
        )
        result.push(...pages);
    }
    return result;
}