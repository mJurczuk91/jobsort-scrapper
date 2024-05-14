import parseOffer from "./src/parseOffer.js";
import extractOfferUrls from "./src/extractOfferUrls.js";
import parseOfferUrlRepository from "../util/parseOfferUrlRepository.js";
import skipCookies from "../util/skipCookies.js";
import parseOfferUrlArray from "../util/parseOfferUrlArray.js";

const offerUrlRepositories = [
    'https://www.pracuj.pl/praca/junior%20javascript;kw',
    'https://www.pracuj.pl/praca/junior%20react;kw',
    'https://www.pracuj.pl/praca/junior%20web%20developer;kw',
]

export default async function scrapePracujpl(techLookedFor, page) {
    await page.goto('https://www.pracuj.pl', {
        waitUntil: "domcontentloaded",
    });
    await skipCookies(page, '[data-test="button-submitCookie"]');

    //const offerUrlArray = ['https://www.pracuj.pl/praca/junior-qa-automation-engineer-katowice-wroclawska-54,oferta,1003308393'];
    const offerUrlArray = [];
    //const offerUrlArray = await parseOfferUrlRepository(page, offerUrlRepositories, extractOfferUrls);
    if (offerUrlArray.length === 0) {
        const message = 'no offers found in parsepracujpl';
        //throw new Error('bum')
        return Promise.reject(message);
    }

    const parsedOffers = await parseOfferUrlArray(offerUrlArray, 'pracuj.pl', techLookedFor, page, parseOffer);
    return parsedOffers;
}



