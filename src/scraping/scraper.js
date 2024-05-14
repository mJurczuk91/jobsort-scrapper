import puppeteer from "puppeteer";
import scrapePracujpl from "./pracujpl/index.js"
import { logError } from "../lib.js";

async function scrapeAll() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const scrapers = [{
        name: 'pracujpl',
        scrape: async (page) => {
            return await scrapePracujpl(
                page,
            );
        }
    },
    ]

    const pages = new Map();
    for(let scraper of scrapers){
        const page = await browser.newPage();
        pages.set(
            scraper.name,
            page,
        )
    }

/*     const offers = await scrapers[0].scrape(
        pages.get(scrapers[0].name)
    ); */

    const offers = await Promise.allSettled(
        scrapers.map(scraper => {
            return new Promise(async (resolve, reject) => {
                try{
                    const result = await scraper.scrape(
                        pages.get(scraper.name)
                    )
                    resolve(result)
                } catch (e){
                    reject(`scraper ${scraper.name} failed, ${e.message ?? e}`);
                } finally {
                    pages.get(scraper.name).close();
                    pages.delete(scraper.name);
                }
            })
        })
    )
    .then(results => results.map(promiseResult => {
        if(promiseResult.status === 'rejected'){
            logError(promiseResult);
            return [];
        }
        return promiseResult.value;
    }))
    .finally(async () => {
        await browser.close()
    });

    if (offers.flat().length === 0) {
        logError({
            message: 'NO OFFERS FOUND AT ALL, SOMETHING IS REALLY WRONG',
        })
        return [];
    }
    return offers.flat();
}

export const scraper = {
    scrapeAll,
}
