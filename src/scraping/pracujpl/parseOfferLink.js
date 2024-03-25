import puppeteer from "puppeteer";
import skipCookies from "./skipCookies.js";
import { delay } from "../../lib.js";

export default async function parseOfferLink(link){

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto(link, {
        waitUntil: "networkidle0",
    });

    await skipCookies(page);
    await delay(3000);

    const jobTitle = await getJobTitle(page, link);
    const benefits = await getBenefits(page, link);
    const technologies = await getTechnologies(page, link);
    const responsibilities = await getResponsibilities(page, link);
    const requirements = await getRequirements(page, link);
    const optionalRequirements = await getOptionalRequirements(page, link);
    const description = await getAbout(page, link);

    return {
        "Job title: ": jobTitle,
        "Benefits: ": benefits,
        "Job description: ": description,
        "Required technologies: ": technologies,
        "Responsibilities: ": responsibilities,
        "Requirements: ": requirements,
        "Nice to have: ": optionalRequirements,
    }
}

async function getJobTitle(page, link) {
    try{
        return await page.evaluate(() => {
            return document.querySelector('[data-scroll-id="job-title"]').textContent;
        })
    } catch(e){
        throw new Error(JSON.stringify({
            message: 'Error trying to parse job title section',
            date: new Date().getTime(),
            link,
        }))
    }
}

async function getBenefits(page, link) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-offerHeader"] .offer-viewXo2dpV'))
            .map(benefit => benefit.textContent);
        })
    } catch(e){
        throw new Error(JSON.stringify({
            message: 'Error trying to parse benefits section',
            date: new Date().getTime(),
            link,
        }))
    }
}

async function getTechnologies(page, link) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-technologies-expected"] li p'))
            .map(technologyNode => technologyNode.textContent);
        })
    } catch(e){
        throw new Error(JSON.stringify({
            message: 'Error trying to parse technologies section',
            date: new Date().getTime(),
            link,
        }))
    }
}

async function getResponsibilities(page, link) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-responsibilities"] li p'))
            .map(responsibility => responsibility.textContent);
        })
    } catch(e){
        throw new Error(JSON.stringify({
            message: 'Error trying to parse responsibilities section',
            date: new Date().getTime(),
            link,
        }))
    }
}

async function getRequirements(page, link) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-requirements-expected"] li p'))
            .map(req => req.textContent);
        })
    } catch(e){
        throw new Error(JSON.stringify({
            message: 'Error trying to parse requirements section',
            date: new Date().getTime(),
            link,
        }))
    }
}

async function getOptionalRequirements(page, link) {
    try{
        return await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[data-test="section-requirements-expected"] li p'))
            .map(req => req.textContent);
        })
    } catch(e){
        throw new Error(JSON.stringify({
            message: 'Error trying to parse optional requirements section',
            date: new Date().getTime(),
            link,
        }))
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
        throw new Error(JSON.stringify({
            message: 'Error trying to parse about section',
            date: new Date().getTime(),
            link,
        }))
    }
}