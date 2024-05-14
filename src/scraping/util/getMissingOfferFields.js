export default function getMissingOfferFields(offer, requiredFields){
    let missingFieldsArr = [];
    for(let field of requiredFields){
        if(!offer[field]){
            missingFieldsArr.push(field);
        }
    }
    if(missingFieldsArr.length === 0) {
        return null;
    }
    return missingFieldsArr;
}