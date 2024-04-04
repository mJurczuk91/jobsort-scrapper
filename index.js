import { scraper } from "./src/scraping/scraper.js";
import fs from 'fs'
import { configDotenv } from "dotenv";
import { uploadOffer } from "./src/uploader.js";
import parseOfferLink from "./src/scraping/pracujpl/parseOfferLink.js";
import puppeteer from "puppeteer";
configDotenv();

const array = await scraper.scrapeAll();

console.log('scraped offers: ', array.length);
fs.appendFile("output.txt", JSON.stringify(array), (err) => {
    err && fs.appendFile("err.txt", JSON.stringify(err).concat(new Date().toLocaleDateString()), ()=>{})
});

for(let offer of array){
    await uploadOffer(offer);
}