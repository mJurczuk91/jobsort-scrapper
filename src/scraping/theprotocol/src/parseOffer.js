import { delay } from "../../../lib.js";

export default async function parseOffer(page, link) {
    await page.goto(link, {
        waitUntil: "domcontentloaded",
    });
    await delay(2000);

    const offer = {
        title: await getJobTitle(page) ?? '',
        description: await getJobDescription(page) ?? '',
        technologies: await getTechnologies(page) ?? '',
        responsibilities: await getResponsibilities(page) ?? '',
        requirements: await getRequirements(page) ?? '',
        optionalRequirements: await getOptionalRequirements(page) ?? '',
        offerValidDate: await getOfferValidDate(page) ?? '',
    }
    return !offer.title && !offer.description && !offer.technologies && !offer.responsibilities && !offer.requirements && !offer.optionalRequirements ? null : offer;
}

async function getJobTitle(page) {
    try {
        const title = await page.$eval(
            'h1',
            (header) => header.textContent,
        );
        return title;
    }
    catch (e) {
        return null
    }
}

async function getJobDescription(page) {
    try {
        const result = await getSectionTextContent(page, '[data-test="section-about-project"]');
        return result.length > 0 ? result : null;
    }
    catch (e) {
        return null
    }
}

async function getTechnologies(page) {
    try {
        const technologies = await page.$eval(
            '[data-test="section-technologies"] .Container_cv2t83c',
            (node) => {
                const result = [];
                const spans = node.querySelectorAll('[data-test="chip-technology"] span');
                for (let span of spans) {
                    result.push(span.textContent);
                }
                return result;
            },
        )
        return technologies;
    }
    catch (e) {
        return null
    }
}

async function getResponsibilities(page) {
    try {
        const result = await getSectionTextContent(page, '[data-test="section-responsibilities"]');
        return result.length > 0 ? result : null;
    }
    catch (e) {
        return null
    }
}

async function getRequirements(page) {
    try {
        const result = await getSectionTextContent(page, '[data-test="section-requirements"]');
        return result.length > 0 ? result : null;
    }
    catch (e) {
        return null
    }
}

async function getOptionalRequirements(page) {
    try {
        const result = await getSectionTextContent(page, '[data-test="section-requirements-optional"]');
        return result.length > 0 ? result : null;
    }
    catch (e) {
        return null
    }
}

async function getOfferValidDate(page) {
    try {
        const regexEnglish = /\d+ days/;
        const regexPolish = /\d+ dni/;
        const textContent = await page.$eval(
            '[data-test="text-expirationDate"]',
            (node) => node.textContent,
        );

        if (!regexEnglish.exec(textContent) && !regexPolish.exec(textContent)) {
            throw new Error('less than 1 day or no date found, 1 day default expiration date will be set by error handling');
        }

        const daysOfferValid = parseInt(/\d+/.exec(textContent)[0]);

        const date = new Date();
        date.setDate(date.getDate() + daysOfferValid);
        const year = date.getFullYear();
        const month = date.getMonth() + 1 < 10 ?
            '0' + (date.getMonth() + 1).toString()
            :
            date.getMonth() + 1;
        const day = date.getDate() < 10 ?
            '0' + date.getDate().toString()
            :
            date.getDate();

        return (`${year}-${month}-${day}`);
    }
    catch (e) {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1 < 10 ?
            '0' + (date.getMonth() + 1).toString()
            :
            date.getMonth() + 1;
        const day = date.getDate();
        return (`${year}-${month}-${day}`);
    }
}

async function getSectionTextContent(page, sectionId) {
    const result = await page.$$eval(
        `${sectionId} [data-test="text-sectionItem"], ${sectionId} [data-test="text-sectionItem"] li span div`,
        (nodeArray) => nodeArray.map(node => node.textContent),
    );
    if (!result) {
        return await page.$eval(
            `${sectionId} [data-test="text-sectionItem"]`,
            (div) => div.textContent,
        )
    } else if (result.length === 0) {
        return undefined;
    } else return result;

}