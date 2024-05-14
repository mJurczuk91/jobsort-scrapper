import { delay } from "../../../lib.js";

export default async function skipPopup(page) {
    const popupCloseSelector = '.popup_p1c6glb0';
    await delay(1000);
    const popupButton = !!await page.$(popupCloseSelector);

    if(popupButton){
        await page.click(popupCloseSelector, {
            waitUntil: "documentloaded",
        });
    }
}