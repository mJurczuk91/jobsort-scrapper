export default async function skipPopup(page) {
    const popupCloseSelector = '.popup_p1c6glb0';

    const popupButton = await page.evaluate(() => {
        return document.querySelector('.popup_p1c6glb0');
    });

    if(popupButton){
        await page.click(popupCloseSelector, {
            waitUntil: "documentloaded",
        });
    }
}