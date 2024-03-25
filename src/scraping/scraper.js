import puppeteer from 'puppeteer';

async function getOfferLinkArray(){
    const mainUrl = "https://www.pracuj.pl/praca/junior%20javascript;kw";

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto(mainUrl, {
        waitUntil: "domcontentloaded",
    });

    const popupCloseSelector = '.popup_p1c6glb0';
    const cookieButtonSelector = '[data-test="button-submitCookie"]';
    await page.click(popupCloseSelector);
    await page.click(cookieButtonSelector, {
        waitUntil: "documentloaded",
    });
    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });

    const offerLinksArray = page.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-test="link-offer"]'))
        .map(link => link.getAttribute('href'));
    });

    return  offerLinksArray;
}

export const parser = {
    parsePracujpl,
}