import { delay } from "./lib.js";
import { VertexAI, HarmCategory, HarmBlockThreshold } from "@google-cloud/vertexai";
import { logError } from "./lib.js";

export async function evaluateOffersDifficulty(offers) {
  const processedOffers = [];

  const project = 'ai-jobseeker-actual';
  const location = 'us-central1';
  const textModel = 'gemini-1.0-pro';

  const vertex_ai = new VertexAI({ project: project, location: location });

  // Instantiate models
  const generativeModel = vertex_ai.getGenerativeModel({
    model: textModel,
    // The following parameters are optional
    // They can also be passed to individual content generation requests
    safety_settings: [{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }],
    generation_config: { max_output_tokens: 256 },
  });

  for(let offer of offers){
    let difficulty = await evaluateOfferDifficulty(generativeModel, offer.parsed);

    if(!difficulty) {
      await delay(1000);
      difficulty = await evaluateOfferDifficulty(generativeModel, offer.parsed);
    }

    if(!difficulty){
      logError({
        message: `Error while evaluating difficulty by gemini ai`,
        date: new Date().toLocaleDateString(),
        offer: `${offer.link}`,
      })
      continue;
    }

    processedOffers.push({
      link: offer.link,
      ...offer.parsed,
      ...difficulty,
    });
  }

  return processedOffers;
}

async function evaluateOfferDifficulty(generativeModel, offer) {

  const task = `You will get a programming job offer in a json format. Read it and respond with the following information: 
  isJuniorFriendly - true or false depending on your evaluation of the offer, if the offer requires a year (12 months) or less experience consider it a junior friendly job, 
  noExperienceRequired - true or false true if the offer requires none or minimal experience,
  shortDescription: a short description of the offer
  It is very important that all 3 required fields are present in the response and in this exact order.
  The response should look like this: 
  {
    isJuniorFriendly: your response
    noExperienceRequired: your response
    shortDescription: your response
  }
  and it should NOT contain any other information`;

  const request = {
    contents: [{
      role: 'user', parts: [
        { text: `${task}. Offer: ${JSON.stringify(offer)}` },
      ]
    }],
  };

  try{
    const streamingResp = await generativeModel.generateContentStream(request);

    const textArray = (await streamingResp.response).candidates[0].content.parts[0].text.split('\n');
  
    const response = {
      isJuniorFriendly: null,
      noExperienceRequired: null,
      shortDescription: null,
    };
  
    function getResponseByKeyword(keyword, responseLine) {
      if (responseLine.toLowerCase().includes(keyword.toLowerCase())) {
        const responseToTrim = responseLine.split(':')[1].trim();
  
        if((responseToTrim[responseToTrim.length-1]) === ','){
          return responseToTrim.slice(0, responseToTrim.length-1);
        }
  
        if(responseToTrim[0] === '"' && responseToTrim[responseToTrim.length-1] === '"'){
          return responseToTrim.slice(1, responseToTrim.length-1);
        }
  
        return responseToTrim;
      }
  
      return null;
    }
  
    for (let line of textArray) {
      response.isJuniorFriendly = response.isJuniorFriendly ?? getResponseByKeyword('isJuniorFriendly', line);
      response.noExperienceRequired = response.noExperienceRequired ?? getResponseByKeyword('noExperienceRequired', line);
      response.shortDescription = response.shortDescription ?? getResponseByKeyword('shortDescription', line);
    }
  
    return response;
  } catch(e) {
    console.log(JSON.stringify(e));
    return null;
  }
}