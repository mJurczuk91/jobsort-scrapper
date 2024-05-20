import { scraper } from "./src/scraping/scraper.js";
import fs from 'fs'
import { configDotenv } from "dotenv";
import { uploadOffer } from "./src/uploader.js";
import { evaluateAllOffers } from "./src/geminiOfferEvaluation.js"; 
import { logError } from "./src/lib.js";

configDotenv();

const techLookedFor = [
    'javascript',
    'typescript',
    'node',
    'react',
];

const jobOffers = await scraper.scrapeAll(techLookedFor);
console.log('scraped offers: ', jobOffers.length);


const correctTechOffers = jobOffers.filter(
    offer => offer.parsed.technologies && offer.parsed.technologies.some(offerTech => {
        return techLookedFor.some(lookedFor => lookedFor === offerTech.toLowerCase());
    })
)
console.log('correct tech offers: ', correctTechOffers.length);

const evaluatedOffers = await evaluateAllOffers(correctTechOffers);
console.log('evaluated offers: ', evaluatedOffers.length);

fs.appendFile("output.txt", JSON.stringify(jobOffers), (err) => {
    err && fs.appendFile("err.txt", JSON.stringify(err).concat(new Date().toLocaleDateString()), () => { })
});

for (let offer of evaluatedOffers) {
    if(!offer.isJuniorFriendly && !offer.noExperienceRequired){
        continue;
    }
    const success = await uploadOffer(offer);
    if(!success){
        logError(`Failed to upload offer: `);
        console.log(offer);
        console.log(JSON.stringify(offer));
    }
} 