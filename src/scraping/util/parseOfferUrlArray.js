import { checkIfLinkIsInDatabase } from "../../lib.js";
import { logError, delay } from "../../lib.js";

export default async function parseOfferUrlArray(offerUrls, domainName, techLookedFor, page, parseOfferFn) {
    const parsedOffers = [];
    console.log(`Total ${domainName} offers: ${offerUrls.length}`);
    let UrlsAlreadyInDBCount = 0;
    let wrongTechCount = 0;
    const wrongTechLinks = [];

    for (let url of offerUrls) {
        const exists = await checkIfLinkIsInDatabase(url);
        if (exists) {
            UrlsAlreadyInDBCount++;
            continue;
        }

        let parsed = await parseOfferFn(page, url)
        .catch((e) => {
            logError(e);
        });
        if (!parsed) {
            logError(`couldnt parse ${url}`)
            continue;
        }

        const correctTechStack = parsed.technologies && parsed.technologies.some(offerTech => {
            for (let tech of techLookedFor) {
                if (offerTech.toLowerCase().includes(tech)) {
                    return true;
                }
            }
            return false;
        });

        parsedOffers.push({
            url,
            parsed,
        });
    }
    console.log(`${domainName} parsing finished`);
    console.log(`${domainName} url already in db: ${UrlsAlreadyInDBCount}`);
    console.log(`${domainName} url skipped due to wrong tech stack: ${wrongTechCount}`);
    console.log(wrongTechLinks);
    console.log(`Final amount of offers parsed in ${domainName}: ${parsedOffers.length}`);
    return parsedOffers;
}