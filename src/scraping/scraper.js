import scrapePracujpl from "./pracujpl/index.js"
import { evaluateOffersDifficulty } from "../geminiOfferEvaluation.js";
import scrapeTheprotocol from "./theprotocol/index.js";

async function scrapeAll() {
    const offers = await Promise.allSettled([
        scrapePracujpl(),
        scrapeTheprotocol(),
    ]).then((results) => {
        return results.map(result => result.value);
    });
    console.log(offers);
    console.log(offers.flat());
    const evaluatedOffers = await evaluateOffersDifficulty(offers.flat());
    return evaluatedOffers;
}

export const scraper = {
    scrapeAll,
}