import { checkIfLinkIsInDatabase } from "../../lib.js";
import { logError, delay } from "../../lib.js";

export default async function parseOfferUrlArray(offerUrls, domainName, page, parseOfferFn) {
    const parsedOffers = [];
    console.log(`Total ${domainName} offers: ${offerUrls.length}`);
    let UrlsAlreadyInDBCount = 0;

    for (let url of offerUrls) {
        if (await checkIfLinkIsInDatabase(url)) {
            UrlsAlreadyInDBCount++;
            continue;
        }

        let parsed = await parseOfferFn(page, url)
        .catch((e) => {
            logError(e);
        });

        if (!parsed) {
            continue;
        }

        parsedOffers.push({
            url,
            parsed,
        });
    }

    console.log(`${domainName} parsing finished`);
    console.log(`${domainName} url already in db: ${UrlsAlreadyInDBCount}`);
    console.log(`Final amount of offers parsed in ${domainName}: ${parsedOffers.length}`);

    return parsedOffers;
}