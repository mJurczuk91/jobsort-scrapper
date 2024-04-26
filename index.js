import { scraper } from "./src/scraping/scraper.js";
import fs from 'fs'
import { configDotenv } from "dotenv";
import { uploadOffer } from "./src/uploader.js";
import scrapeTheprotocol from "./src/scraping/theprotocol/index.js";
import scrapePracujpl from "./src/scraping/pracujpl/index.js";
configDotenv();

const array = await scraper.scrapeAll();

console.log('scraped offers: ', array.length);
fs.appendFile("output.txt", JSON.stringify(array), (err) => {
    err && fs.appendFile("err.txt", JSON.stringify(err).concat(new Date().toLocaleDateString()), ()=>{})
});

for(let offer of array){
    await uploadOffer(offer);
}