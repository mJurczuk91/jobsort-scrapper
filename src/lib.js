export function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export function parsePracujplDateToIso8601(date){
        const [day, monthString, year] = date.split(':')[1].split(' ');
        const monthNum = monthToNumber(monthString);
    
        if(!monthNum){
            return monthNum;
        }
    
        return(`${year}-${monthNum}-${day}`);
}

function monthToNumber(month) {
    if(month === 'jan' || month === 'sty') return '01';
    if(month === 'feb' || month === 'lut') return '02';
    if(month === 'mar' || month === 'mar') return '03';
    if(month === 'apr' || month === 'kwi') return '04';
    if(month === 'may' || month === 'maj') return '05';
    if(month === 'jun' || month === 'cze') return '06';
    if(month === 'jul' || month === 'lip') return '07';
    if(month === 'aug' || month === 'sie') return '08';
    if(month === 'sep' || month === 'wrz') return '09';
    if(month === 'oct' || month === 'paź') return '10';
    if(month === 'nov' || month === 'lis') return '11';
    if(month === 'dec' || month === 'gru') return '12';

    return null;
}

export function logError(error){
    console.log(JSON.stringify(error));
}
