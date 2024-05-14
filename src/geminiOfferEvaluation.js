import { delay } from "./lib.js";
import { VertexAI, HarmCategory, HarmBlockThreshold } from "@google-cloud/vertexai";
import { logError } from "./lib.js";

export async function evaluateOffersDifficulty(offers) {
  const project = 'ai-jobseeker-actual';
  const location = 'us-central1';
  const textModel = 'gemini-1.0-pro';

  const vertex_ai = new VertexAI({ project: project, location: location });

  const generativeModel = vertex_ai.getGenerativeModel({
    model: textModel,
    //safety_settings: [{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }],
    generation_config: {
      max_output_tokens: 256,
      responseMimeType: 'application/json'
    },
  });

  const processedOffers = [];
  for (let offer of offers) {
    const evaluated = await evaluateOfferDifficulty(generativeModel, offer.parsed);
    if (evaluated) {
      processedOffers.push({
        link: offer.link,
        ...offer.parsed,
        ...evaluated,
      });
    }
  }
  return processedOffers;
}

async function evaluateOfferDifficulty(generativeModel, offer) {
  const task = `You will get a programming job offer in a json format. Respond with a json object containing following three fields: 
  isJuniorFriendly - true or false depending on your evaluation of the offer, if the offer requires a year (12 months) or less experience consider it a junior friendly job, 
  noExperienceRequired - true or false true if the offer requires none or minimal experience,
  shortDescription: a short description of the offer`

  const request = {
    contents: [{
      role: 'user', parts: [
        { text: `${task}. Offer: ${JSON.stringify(offer)}` },
      ]
    }],
  }

  const result = await generativeModel.generateContent(request);
  const response = result.response;
  try {
    return JSON.parse(response.candidates[0].content.parts[0].text);
  } catch (e) {
    return null;
  }
}