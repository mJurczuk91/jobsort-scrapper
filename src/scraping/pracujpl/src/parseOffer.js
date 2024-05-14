import { delay } from "../../../lib.js";
import getMissingOfferFields from "../../util/getMissingOfferFields.js";

export default async function parseOffer(page, url) {

    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });
    await delay(2000);

    const offer = {
        title: await getJobTitle(page),
        description: await getAbout(page),
        technologies: await getTechnologies(page),
        responsibilities: await getResponsibilities(page),
        requirements: await getRequirements(page),
        optionalRequirements: await getOptionalRequirements(page),
        offerValidDate: await getOfferValidDate(page),
    }

    const requiredFields = [
        'technologies', 
        'offerValidDate', 
        'requirements',
    ];
    
    const missingFields = getMissingOfferFields(offer, requiredFields);
    if (missingFields) {
        throw new Error((`offer ${url} missing required fields: ${missingFields.join(', ')}`));
    }

    return offer;
}


async function getOfferValidDate(page) {
    try {
        const date = await page.evaluate(() => {
            return document.querySelector('[data-test="sections-benefit-expiration"] [data-test="offer-badge-description"]').textContent;
        });
        const parsed = parsePracujplDateToIso8601(date);
        if(!parsed){
            return null;
        }
        return parsed;
    }
    catch(e){
        return null;
    }
}

async function getJobTitle(page) {
    return await page.evaluate(() => {
        return document.querySelector('[data-scroll-id="job-title"]').textContent;
    })
}

async function getTechnologies(page) {
    return await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-test="section-technologies-expected"] li p'))
            .map(technologyNode => technologyNode.textContent);
    })
}

async function getResponsibilities(page) {
    const selectors = [
        '[data-test="section-responsibilities"] li p',
        '[data-test="section-responsibilities"] li',
        '[data-test="section-responsibilities"] p',
    ]
    for (let selector of selectors) {
        try{
            const result = await page.$$eval(
                selector,
                nodeArr => nodeArr.map(node => node.textContent),
            );
            if(result.length > 0){
                return result;
            }
        }
        catch(e){
            continue;
        }
    }
    return null;
}

async function getRequirements(page) {
    const selectors = [
        '[data-test="section-requirements-expected"] li p',
        '[data-test="section-requirements-expected"] li',
        '[data-test="section-requirements-expected"] p',
        '[data-scroll-id="requirements-expected-1"] li p',
        '[data-scroll-id="requirements-expected-1"] li',
        '[data-scroll-id="requirements-expected-1"] p',
    ]
    for (let selector of selectors) {
        try{
            const result = await page.$$eval(
                selector,
                nodeArr => nodeArr.map(node => node.textContent),
            );
            if(result.length > 0){
                return result;
            }
        }
        catch(e){

        }
    }
    return null;
}

async function getOptionalRequirements(page) {
    const selectors = [
        '[data-test="section-requirements-optional"] li p',
        '[data-test="section-requirements-optional"] li',
        '[data-test="section-requirements-optional"] p',
    ]
    for (let selector of selectors) {
        try{
            const result = await page.$$eval(
                selector,
                nodeArr => nodeArr.map(node => node.textContent),
            );
            if(result.length > 0){
                return result;
            }
        }
        catch(e){

        }
    }
    return null;
}

async function getAbout(page) {
    return await page.evaluate(() => {
        const textContentArray = Array.from(document.querySelectorAll('[data-test="text-about-project"] p'))
            .map(about => about.textContent);
        if(textContentArray.length === 0){
            return null;
        }
        if(textContentArray.length === 1){
            return textContentArray[1];
        } else return textContentArray;
    })
}

function parsePracujplDateToIso8601(date) {
    const [,day, monthString, year] = date.split(' ');
    const monthNum = monthToNumber(monthString);
    if (!monthNum) {
        return monthNum;
    }

    return (`${year}-${monthNum}-${day}`);
}

function monthToNumber(month) {
    const monthLower = month.toLowerCase();

    if (monthLower === 'january' || monthLower === 'stycznia') return '01';
    if (monthLower === 'february' || monthLower === 'lutego') return '02';
    if (monthLower === 'march' || monthLower === 'marca') return '03';
    if (monthLower === 'april' || monthLower === 'kwietnia') return '04';
    if (monthLower === 'may' || monthLower === 'maja') return '05';
    if (monthLower === 'june' || monthLower === 'czerwca') return '06';
    if (monthLower === 'july' || monthLower === 'lipca') return '07';
    if (monthLower === 'august' || monthLower === 'sierpnia') return '08';
    if (monthLower === 'september' || monthLower === 'września') return '09';
    if (monthLower === 'october' || monthLower === 'października') return '10';
    if (monthLower === 'november' || monthLower === 'listopada') return '11';
    if (monthLower === 'december' || monthLower === 'grudnia') return '12';

    return null;
}