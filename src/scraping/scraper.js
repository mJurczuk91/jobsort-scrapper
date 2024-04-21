import scrapePracujpl from "./pracujpl/index.js"
import { evaluateOffersDifficulty } from "../geminiOfferEvaluation.js";

async function scrapeAll () {
    const pracujplOffers = await scrapePracujpl();
    const evaluatedOffers = await evaluateOffersDifficulty(pracujplOffers);
    return evaluatedOffers;
}

export const scraper = {
    scrapeAll,
}