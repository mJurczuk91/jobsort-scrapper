import parsePracujpl from "./pracujpl/parsePracujpl.js"

async function scrapeAll () {
    const pracujplOffers = await parsePracujpl();
    return pracujplOffers;
}

export const scraper = {
    scrapeAll,
}