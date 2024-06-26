import skipCookies from "../util/skipCookies.js";
import { delay } from "../../lib.js";
import { parsePracujplDateToIso8601 } from "../../lib.js";

export default async function parseOfferLink(page, link){

    await page.goto(link, {
        waitUntil: "domcontentloaded",
    });
    await delay(2000);

    const offer = {
        title: await getJobTitle(page) ?? '',
        description: await getAbout(page) ?? '',
        technologies: await getTechnologies(page) ?? '',
        responsibilities: await getResponsibilities(page) ?? '',
        requirements: await getRequirements(page) ?? '',
        optionalRequirements: await getOptionalRequirements(page) ?? '',
        offerValidDate: await getOfferValidDate(page) ?? '',
    }

    return !offer.title && !offer.description && !offer.technologies && !offer.responsibilities && !offer.requirements && !offer.optionalRequirements ? null : offer;
}


async function getOfferValidDate(page){
    try{
        const date = await page.evaluate(() => {
            return document.querySelector('[data-test="sections-benefit-expiration"] .offer-viewDZ0got').textContent;
        });
        return parsePracujplDateToIso8601(date);
    } catch(e){
        const date = new Date();
        date.setDate(date.getDate()+1);
        return (`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
    }
}

async function getJobTitle(page) {
    try{
        return await page.evaluate(() => {
            return document.querySelector('[data-scroll-id="job-title"]').textContent;
        })
    } catch(e){
        return null;
    }
}

async function getBenefits(page) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-offerHeader"] .offer-viewXo2dpV'))
            .map(benefit => benefit.textContent);
        })
    } catch(e){
        return null;
    }
}

async function getTechnologies(page) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-technologies-expected"] li p'))
            .map(technologyNode => technologyNode.textContent);
        })
    } catch(e){
        return null;
    }
}

async function getResponsibilities(page) {
    try{
        const result = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-responsibilities"] li p'))
            .map(responsibility => responsibility.textContent);
        });
        if(result.length > 0) return result;

        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-responsibilities"] p'))
            .map(responsibility => responsibility.textContent);
        });
    } catch(e){
        return null;
    }
}

async function getRequirements(page) {
    try{
        const result = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-requirements-expected"] li p'))
            .map(req => req.textContent);
        })
        if(result.length > 0) return result;

        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-requirements-expected"] p'))
            .map(req => req.textContent);
        })
    } catch(e){
        return null;
    }
}

async function getOptionalRequirements(page) {
    try{
        const result = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-requirements-optional"] li p'))
            .map(req => req.textContent);
        })
        if(result.length > 0) return result;

        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-requirements-optional"] p'))
            .map(req => req.textContent);
        })
    } catch(e){
        return null;
    }
}

async function getAbout(page) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="text-about-project"] p'))
            .map(about => about.textContent)
            .reduce( (prev, curr ) => {
                if(curr === '::after') return prev.concat(' ');
                return prev.concat(curr);
            });
        })
    } catch(e){
        return null;
    }
}