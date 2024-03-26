import { scraper } from "./src/scraping/scraper.js";
import fs from 'fs'

const array = scraper.scrapeAll().then(data => {
    console.log(data.length);
    fs.appendFile("output.txt", JSON.stringify(data), (err) => {
        err && fs.appendFile("err.txt", JSON.stringify(err).concat(new Date().toLocaleDateString()), ()=>{})
    });
    return data;
});
