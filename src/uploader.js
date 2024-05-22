import { logError } from "./lib.js";

export const uploadOffer = async (offer) => {
    if(!process.env.API_KEY){
        throw new Error('API KEY ENV NOT SET');
    }
    if(!process.env.API_URL){
        throw new Error('API URL ENV NOT SET');
    }

    const customHeaders = {
        "Content-Type": "application/json",
        "key": process.env.API_KEY,
    };

    const url = `${process.env.API_URL}/offer`;

    const response = await fetch(url, {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(offer),
    });
    if(!response.ok){
        logError(`Failed to upload offer ${JSON.stringify(offer)}`);
    }
    return response.ok;
}