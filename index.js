import { scraper } from "./src/scraping/scraper.js";
import fs from 'fs'
import { configDotenv } from "dotenv";
import { uploadOffer } from "./src/uploader.js";
import { evaluateOfferArray } from "./src/geminiOfferEvaluation.js";
import { logError } from "./src/lib.js";

configDotenv();

const jobOffers = await scraper.scrapeAll();
console.log('scraped offers: ', jobOffers.length);
fs.appendFile("scraped.txt", JSON.stringify(jobOffers), (err) => {
    err && fs.appendFile("err.txt", JSON.stringify(err).concat(new Date().toLocaleDateString()), () => { })
});

const evaluatedOffers = await evaluateOfferArray(correctTechOffers);
console.log('evaluated offers: ', evaluatedOffers.length);
fs.appendFile("evaluated.txt", JSON.stringify(evaluatedOffers), (err) => {
    err && fs.appendFile("err.txt", JSON.stringify(err).concat(new Date().toLocaleDateString()), () => { })
});

for (let offer of evaluatedOffers) {
    if (offer.evaluated.isJuniorFriendly === undefined || offer.evaluated.noExperienceRequired === undefined) {
        logError(`Offer ${JSON.stringify(offer)} not evaluated properly (noexperiencerequired or isjuniorfriendly are undefined)`);
        continue;
    }
    const success = await uploadOffer({
        url: offer.link,
        description: offer.evaluated.shortDescription,
        technologies: offer.parsed.technologies,
        isJuniorFriendly: offer.evaluated.isJuniorFriendly,
        noExperienceRequired: offer.evaluated.noExperienceRequired,
        offerValidDate: offer.parsed.offerValidDate,
    });
    if (!success) {
        logError(`Failed to upload offer: `);
        console.log(offer);
    }
} 