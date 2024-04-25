import parseOfferLink from "./parseOfferLink.js";
import puppeteer from "puppeteer";
import { checkIfLinkIsInDatabase, delay } from "../../lib.js";
import { logError } from "../../lib.js";
import searchResultsParser from "./searchResultsParser.js";
import scrapeOfferLinks from "../util/scrapeOfferLinks.js";
import skipPopup from "./skipPopup.js";
import skipCookies from "../util/skipCookies.js";

const searchLinks = [
    'https://www.pracuj.pl/praca/junior%20javascript;kw',
    'https://www.pracuj.pl/praca/junior%20react;kw',
    'https://www.pracuj.pl/praca/junior%20web%20developer;kw',
];

const techLookedFor = [
    'javascript',
    'typescript',
    'node',
    'react',
    'script',
]

export default async function scrapePracujpl(){

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage()
    await page.goto('https://www.pracuj.pl', {
        waitUntil: "domcontentloaded",
    });
    await delay(2000);
    await skipCookies(page, '[data-test="button-submitCookie"]');
    await delay(3000);

    const offers = await scrapeOfferLinks(page, searchLinks, searchResultsParser);

    if(offers.length === 0){
        console.log('no offers found in parsepracujpl');
        return;
    }

    const parsedOffers = [];
    console.log('Links before parsing: ', offers.length);
    let linksAlreadyInDBCount = 0;
    let wrongTechCount = 0;
    const wrongTechLinks = [];
    for(let link of offers){
        const exists = await await checkIfLinkIsInDatabase(link);
            if(exists){
                linksAlreadyInDBCount++;
                continue;
            }

            let parsed = await parseOfferLink(page, link);

            if(!parsed){
                await delay(3000);
                parsed = await parseOfferLink(page, link);
            }

            if(!parsed){
                throw new Error(`Parsing link ${link} failed`);
            }
            
            const correctTechStack = parsed.technologies && parsed.technologies.some(offerTech => {
                for(let tech of techLookedFor){
                    if(offerTech.toLowerCase().includes(tech)){
                        return true;
                    }
                }
                return false;
            });

            if(!correctTechStack){
                wrongTechCount++;
                wrongTechLinks.push(link);
                continue;
            }
            
            parsedOffers.push({
                link,
                parsed,
            });
        try{
            
        }        
        catch(e){
            logError(`Parsing link ${link} failed`);
            continue;
        }
    }
    console.log('Links already in db: ', linksAlreadyInDBCount);
    console.log('Links skipped due to wrong tech stack: ', wrongTechCount);
    console.log(wrongTechLinks);
    await page.close();
    await browser.close();
    return parsedOffers;
}