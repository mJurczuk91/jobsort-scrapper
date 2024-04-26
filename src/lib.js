export function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export async function checkIfLinkIsInDatabase(link){
    const url = `${process.env.API_URL}/offerByLink`;
    const customHeaders = {
        "Content-Type": "application/json",
        "key": process.env.API_KEY,
    };
    
    const resp = await fetch(url, {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify({link}),
    });
    const json = await resp.json();

    return json && json.length > 0;
}

export function parsePracujplDateToIso8601(date) {
    const [day, monthString, year] = date.split(':')[1].trim().split(' ');
    const monthNum = monthToNumber(monthString);

    if (!monthNum) {
        return monthNum;
    }

    return (`${year}-${monthNum}-${day}`);
}

function monthToNumber(month) {
    const monthLower = month.toLowerCase();

    if (monthLower === 'jan' || monthLower === 'sty') return '01';
    if (monthLower === 'feb' || monthLower === 'lut') return '02';
    if (monthLower === 'mar' || monthLower === 'mar') return '03';
    if (monthLower === 'apr' || monthLower === 'kwi') return '04';
    if (monthLower === 'may' || monthLower === 'maj') return '05';
    if (monthLower === 'jun' || monthLower === 'cze') return '06';
    if (monthLower === 'jul' || monthLower === 'lip') return '07';
    if (monthLower === 'aug' || monthLower === 'sie') return '08';
    if (monthLower === 'sep' || monthLower === 'wrz') return '09';
    if (monthLower === 'oct' || monthLower === 'paź') return '10';
    if (monthLower === 'nov' || monthLower === 'lis') return '11';
    if (monthLower === 'dec' || monthLower === 'gru') return '12';

    return null;
}

export function logError(error) {
    console.log(JSON.stringify(error));
}

function escapeSingleQuotes(string){
    if(!string) return 'SOMETHING WENT WRONG'
    return string.replaceAll(`'`, `''`);
}

export function normalizeOffer(offer){
    const result = {};
    if(offer.link){
        result.link = offer.link;
    }
    if(offer.shortDescription){
        result.description = escapeSingleQuotes(offer.shortDescription);
    } else {
        result.description = escapeSingleQuotes(offer.description);
    }
    if(offer.title){
        result.title = escapeSingleQuotes(offer.title);
    }
    if(offer.technologies && offer.technologies.length > 0){
        result.technologies = offer.technologies.map(tech => escapeSingleQuotes(tech));
    }
    if(offer.responsibilities && offer.responsibilities.length > 0){
        result.responsibilities = offer.responsibilities.map(responsibility => escapeSingleQuotes(responsibility));
    }
    if(offer.requirements && offer.requirements.length > 0){
        result.requirements = offer.requirements.map(req => escapeSingleQuotes(req));
    }
    if(offer.optionalRequirements && offer.optionalRequirements.length > 0){
        result.optionalRequirements = offer.optionalRequirements.map(optReq => escapeSingleQuotes(optReq));
    }
    if(offer.offerValidDate){
        result.offerValidDate = offer.offerValidDate;
    }
    if(offer.isJuniorFriendly){
        result.isJuniorFriendly = offer.isJuniorFriendly;
    }
    if(offer.noExperienceRequired){
        result.noExperienceRequired = offer.noExperienceRequired;
    }
    return result;
}