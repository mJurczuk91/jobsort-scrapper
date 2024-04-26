import parseOfferLink from "./parseOfferLink.js";
import puppeteer from "puppeteer";
import { logError } from "../../lib.js";
import searchResultsParser from "./searchResultsParser.js";
import scrapeOfferLinks from "../util/scrapeOfferLinks.js";
import skipCookies from "../util/skipCookies.js";
import parseOfferLinkArray from "../util/parseOfferLinkArray.js";

const searchLinks = [
    'https://www.pracuj.pl/praca/junior%20javascript;kw',
    'https://www.pracuj.pl/praca/junior%20react;kw',
    'https://www.pracuj.pl/praca/junior%20web%20developer;kw',
];

const techLookedFor = [
    'javascript',
    'typescript',
    'node',
    'react',
    'script',
]

export default async function scrapePracujpl() {

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });

    const page = await browser.newPage()
    await page.goto('https://www.pracuj.pl', {
        waitUntil: "domcontentloaded",
    });
    await skipCookies(page, '[data-test="button-submitCookie"]');

    const offerLinks = await scrapeOfferLinks(page, searchLinks, searchResultsParser);
    if (offerLinks.length === 0) {
        logError('no offers found in parsepracujpl');
        return [];
    }

    const parsedOffers = await parseOfferLinkArray(offerLinks, 'pracuj.pl', techLookedFor, page, parseOfferLink);

    await page.close();
    await browser.close();

    return parsedOffers;
}