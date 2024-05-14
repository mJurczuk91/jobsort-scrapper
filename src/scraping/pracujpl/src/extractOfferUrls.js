export default async function extractOfferUrls(page) {
    
    const offerLinksArray = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-test="link-offer"]'))
            .map(href => {
                const [link,] = href.getAttribute('href').split('?');
                return link;
            });
    });
    
    return offerLinksArray;
}

