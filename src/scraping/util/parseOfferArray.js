import { checkIfLinkIsInDatabase } from "../../lib.js";
import { logError } from "../../lib.js";

export default async function parseOfferArray(offerLinks, domainName, techLookedFor, page, offerParser) {
    const parsedOffers = [];
    console.log(`Total ${domainName} offers: ${offerLinks.length}`);
    let linksAlreadyInDBCount = 0;
    let wrongTechCount = 0;
    const wrongTechLinks = [];
    for (let link of offerLinks) {
        const exists = await await checkIfLinkIsInDatabase(link);
            if (exists) {
                linksAlreadyInDBCount++;
                continue;
            }

            let parsed = await offerParser(page, link);

            if (!parsed) {
                await delay(3000);
                parsed = await offerParser(page, link);
            }

            if (!parsed) {
                throw new Error(`Parsing link ${link} failed`);
            }

            const correctTechStack = parsed.technologies && parsed.technologies.some(offerTech => {
                for (let tech of techLookedFor) {
                    if (offerTech.toLowerCase().includes(tech)) {
                        return true;
                    }
                }
                return false;
            });

            if (!correctTechStack) {
                wrongTechCount++;
                wrongTechLinks.push(link);
                continue;
            }

            parsedOffers.push({
                link,
                parsed,
            });
        try {
            
        }
        catch (e) {
            logError(`Parsing link ${link} failed`);
            continue;
        }
    }
    console.log(`${domainName} parsing finished`);
    console.log(`${domainName} links already in db: ${linksAlreadyInDBCount}`);
    console.log(`${domainName} links skipped due to wrong tech stack: ${wrongTechCount}`);
    console.log(wrongTechLinks);
    return parsedOffers;
}