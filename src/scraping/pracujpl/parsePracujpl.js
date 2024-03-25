import parseOfferLink from "./parseOfferLink.js";
import getOfferLinksArray from "./getOfferLinksArray.js";
import puppeteer from "puppeteer";
import { delay } from "../../lib.js";

const serachLinks = [
    'https://www.pracuj.pl/praca/junior%20javascript;kw',
];

export default async function parsePracujpl(){

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const finalOfferLinks = [];

    for(let link of serachLinks){
        const partialOfferLinkArray = await getOfferLinksArray(browser, link);

        if(partialOfferLinkArray.length === 0) {
            console.log('No links found while parsing ', link);
            return;
        }

        for(let offerLink of partialOfferLinkArray){
            if(!finalOfferLinks.find(link => link === offerLink)){
                finalOfferLinks.push(offerLink);
            }
        };
    }

    if(finalOfferLinks.length === 0){
        console.log('no offers found in parsepracujpl');
        return;
    }

    const parsedOffers = [];

    for(let link of finalOfferLinks){
        try{
            delay(5000);
            const parsed = await parseOfferLink(browser, link);
            parsedOffers.push({
                link,
                parsed,
            });
        }
        catch(e){
            logError(e);
            continue;
        }
    }
    
    await browser.close();
    return parsedOffers;
}

function logError(error){
    console.log(error);
}