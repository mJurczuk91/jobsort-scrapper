import { scraper } from "./src/scraping/scraper.js";

const array = scraper.scrapeAll().then(res => {
    console.log(res.length);
    for(let item of res){
        console.log(JSON.stringify(item));
    }
    return res;
});
