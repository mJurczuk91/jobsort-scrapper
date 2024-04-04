import { normalizeOffer } from "./lib.js";

export const uploadOffer = async (offer) => {
    if(!process.env.API_KEY){
        throw new Error('API KEY ENV NOT SET');
    }
    if(!process.env.API_URL){
        throw new Error('API URL ENV NOT SET');
    }

    const normalizedOffer = normalizeOffer(offer);

    console.log(normalizedOffer);
    const customHeaders = {
        "Content-Type": "application/json",
        "key": process.env.API_KEY,
    };

    const url = `${process.env.API_URL}/offer`;

    const response = await fetch(url, {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(normalizedOffer),
    });
    return response.ok;
}