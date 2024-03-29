import parseOfferLink from "./parseOfferLink.js";
import getOfferLinksArray from "./getOfferLinksArray.js";
import puppeteer from "puppeteer";
import { delay } from "../../lib.js";
import { logError } from "../../lib.js";

const serachLinks = [
    'https://www.pracuj.pl/praca/junior%20javascript;kw',
];

const techLookedFor = [
    'javascript',
    'typescript',
    'node',
    'react',
    'script',
]

export default async function parsePracujpl(){

    const browser = await puppeteer.launch({
        headless: true,
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
            await delay(3000);
            let parsed = await parseOfferLink(browser, link);

            if(!parsed){
                await delay(6000);
                parsed = await parseOfferLink(browser, link);
            }

            parsed && parsed.technologies.some(offerTech => {
                for(let tech of techLookedFor){
                    if(offerTech.toLowerCase().includes(tech)){
                        return true;
                    }
                }
                return false;
            }) && parsedOffers.push({
                link,
                parsed,
            });

            !parsed && logError({
                message: `error parsing link ${link}`,
                date: new Date().toLocaleDateString(),
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