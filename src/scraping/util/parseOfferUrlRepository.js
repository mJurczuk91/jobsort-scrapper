import { delay } from "../../lib.js";

export default async function parseOfferUrlRepository(page, offerUrlRepository, extractOfferUrlsFn){
    const finalOfferUrlArr = [];
    
    for(let url of offerUrlRepository){
        await page.goto(url, {
            waitUntil: "domcontentloaded",
        });
        await delay(3000);

        const partialOfferUrlArray = await extractOfferUrlsFn(page);
        if(partialOfferUrlArray.length === 0) {
            continue;
        }

        for(let offerUrl of partialOfferUrlArray){
            if(!finalOfferUrlArr.find(finalUrl => finalUrl === offerUrl)){
                finalOfferUrlArr.push(offerUrl);
            }
        };
    }

    return finalOfferUrlArr;
}