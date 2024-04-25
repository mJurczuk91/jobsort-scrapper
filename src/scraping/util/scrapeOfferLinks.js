import { delay } from "../../lib.js";

export default async function scrapeOfferLinks(page, searchResultsArr, offerLinkParser){
    const finalOfferLinks = [];
    
    for(let link of searchResultsArr){ 
        await page.goto(link, {
            waitUntil: "domcontentloaded",
        });
        await delay(4000);

        const partialOfferLinkArray = await offerLinkParser(page);
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