export default async function searchResultsParser(page) {
    const offerLinksArray = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-test="list-item-offer"]'))
            .map(href => {
                return href.getAttribute('href');
            });
    });
    
    return offerLinksArray.map(href => {
        const host = new URL(page.url()).host;
        return `https://${host}${href}`
    });
}