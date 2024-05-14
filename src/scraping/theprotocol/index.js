import parseOffer from "./src/parseOffer.js";
import extractOfferUrls from "./src/extractOfferUrls.js";
import skipCookies  from "../util/skipCookies.js";
import parseOfferUrlArray from "../util/parseOfferUrlArray.js";
import parseOfferUrlRepository from "../util/parseOfferUrlRepository.js";
import { delay } from "../../lib.js";


const offerUrlRepositories = [
    'https://theprotocol.it/filtry/javascript,node.js,react.js,typescript;t/junior,trainee,assistant;p',
]

//const offer = 'https://theprotocol.it/szczegoly/praca/frontend---javascript---typescript-developer-bialystok-aleja-jozefa-pilsudskiego-6-1,oferta,21ff0000-3214-86a3-5818-08dc645e2547?s=5358332323&searchId=fae0f2d0-03a8-11ef-b992-030a8d77b7f7'
export default async function scrapeTheprotocol(page) {
    await page.goto('https://theprotocol.it', {
        waitUntil: "domcontentloaded",
    });
    await skipCookies(page, '[data-test="button-acceptAll"]');
    
    const offerUrlRepositoriesPages = await getPagination(page, offerUrlRepositories);

    const offerUrls = await parseOfferUrlRepository(
        page,
        offerUrlRepositoriesPages,
        extractOfferUrls,
    );

    if (offerUrls.length === 0) {
        logError('no offers found in theprotocol');
        return [];
    }

    const parsedOffers = await parseOfferUrlArray(
        offerUrls,
        'www.theprotocol.it',
        page,
        parseOffer
    );
    return parsedOffers;
}

async function getPagination(page, offerUrlRepositories) {
    const results = [];

    for (let url of offerUrlRepositories) {
        await page.goto(url);
        await delay(3000);

        try {
            await page.$eval(
                '[data-test="anchor-pageNumber"]',
                element => element.href,
            )
        }
        catch (e) {
            results.push(url);
            continue;
        }

        const pages = await page.$$eval(
            '[data-test="anchor-pageNumber"]',
            (array) => array.map((pageNumber) => {
                return pageNumber.href
            }),
        )
        results.push(...pages);
    }
    return results;
}