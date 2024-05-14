import { scraper } from "./src/scraping/scraper.js";
import fs from 'fs'
import { configDotenv } from "dotenv";
import { uploadOffer } from "./src/uploader.js";

configDotenv();

const techLookedFor = [
    'javascript',
    'typescript',
    'node',
    'react',
    'script',
];

const jobOffers = await scraper.scrapeAll(techLookedFor);
const evaluatedOffers = await evaluateOffersDifficulty(offers);

console.log('scraped offers: ', jobOffers.length);
console.log(jobOffers);


fs.appendFile("output.txt", JSON.stringify(array), (err) => {
    err && fs.appendFile("err.txt", JSON.stringify(err).concat(new Date().toLocaleDateString()), ()=>{})
});

/* for(let offer of array){
    await uploadOffer(offer);
} */