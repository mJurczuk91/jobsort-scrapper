import { delay } from "../../lib.js";

export default async function scrapeOfferLinks(page, searchResultsUrlArr, searchResultsParser){
    const finalOfferLinks = [];
    
    for(let link of searchResultsUrlArr){
        await page.goto(link, {
            waitUntil: "domcontentloaded",
        });
        await delay(3000);

        const partialOfferLinkArray = await searchResultsParser(page);
        if(partialOfferLinkArray.length === 0) {
            continue;
        }

        for(let offerLink of partialOfferLinkArray){
            if(!finalOfferLinks.find(link => link === offerLink)){
                finalOfferLinks.push(offerLink);
            }
        };
    }

    return finalOfferLinks;
}