import parsePracujpl from "./pracujpl/index.js"

async function scrapeAll () {
    const pracujplOffers = await parsePracujpl();
    return pracujplOffers;
}

export const scraper = {
    scrapeAll,
}