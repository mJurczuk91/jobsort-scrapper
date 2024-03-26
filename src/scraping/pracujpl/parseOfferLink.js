import skipCookies from "./skipCookies.js";
import { delay } from "../../lib.js";

export default async function parseOfferLink(browser, link){

    const page = await browser.newPage();

    await page.goto(link, {
        waitUntil: "networkidle0",
    });

    await skipCookies(page);
    await delay(2000);

    const offer = {
        title: await getJobTitle(page, link) ?? '',
        description: await getAbout(page, link) ?? '',
        technologies: await getTechnologies(page, link) ?? '',
        responsibilities: await getResponsibilities(page, link) ?? '',
        requirements: await getRequirements(page, link) ?? '',
        optionalRequirements: await getOptionalRequirements(page, link) ?? '',
    }

    await page.close();

    return !offer.title && !offer.description && !offer.technologies && !offer.responsibilities && !offer.requirements && !offer.optionalRequirements ? null : offer;
}

async function getJobTitle(page, link) {
    try{
        return await page.evaluate(() => {
            return document.querySelector('[data-scroll-id="job-title"]').textContent;
        })
    } catch(e){
        return null;
    }
}

async function getBenefits(page, link) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-offerHeader"] .offer-viewXo2dpV'))
            .map(benefit => benefit.textContent);
        })
    } catch(e){
        return null;
    }
}

async function getTechnologies(page, link) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-technologies-expected"] li p'))
            .map(technologyNode => technologyNode.textContent);
        })
    } catch(e){
        return null;
    }
}

async function getResponsibilities(page, link) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-responsibilities"] li p'))
            .map(responsibility => responsibility.textContent);
        })
    } catch(e){
        return null;
    }
}

async function getRequirements(page, link) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-requirements-expected"] li p'))
            .map(req => req.textContent);
        })
    } catch(e){
        return null;
    }
}

async function getOptionalRequirements(page, link) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-requirements-optional"] li p'))
            .map(req => req.textContent);
        })
    } catch(e){
        return null;
    }
}

async function getAbout(page, link) {
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