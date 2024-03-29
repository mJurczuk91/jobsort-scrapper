export function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
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