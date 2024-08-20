import { VertexAI } from "@google-cloud/vertexai";
import { delay } from "./lib.js";

export async function evaluateOfferArray(offers) {
  const project = 'ai-jobseeker-actual';
  const location = 'us-central1';
  const textModel = 'gemini-1.5-pro-001';

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
    console.log(`\n evaluating offer ${offer.link} \n`)
    let evaluated = await evaluateOfferDifficulty(generativeModel, offer.parsed);

    if(!evaluated) {
      const delaySeconds = 61;
      await delay(delaySeconds * 1000); // wait so i dont exceed gcloud api quotas
      console.log(`waiting ${delaySeconds} and retrying evaluation`);
      evaluated = await evaluateOfferDifficulty(generativeModel, offer.parsed);
    }

    if(!evaluated) {
      console.log(`Failed to evaluate ${offer.link}\n`);
      continue;
    }

    processedOffers.push({
      link: offer.link,
      parsed: offer.parsed,
      evaluated,
    });
  }
  return processedOffers;
}

async function evaluateOfferDifficulty(generativeModel, offer) {
  const task = `Evaluate this job offer. Respond with a json object containing following three fields: 
  isJuniorFriendly - true or false depending on if the job might be suitable for novice programmers, 
  noExperienceRequired - true or false true if the offer requires none or minimal experience,
  shortDescription: a short description of the offer`

  const request = {
    contents: [{
      role: 'user', parts: [
        { text: `${task}. Offer: ${JSON.stringify(offer)}` },
      ]
    }],
  }

  let result;
  try {
    result = await generativeModel.generateContent(request);
  } catch (e) {
    console.log(e);
    console.log('genai error\n')
    return null;
  }
  const response = result.response;
  try {
    const parsed = JSON.parse(response.candidates[0].content.parts[0].text);
    if(
      parsed.isJuniorFriendly === undefined ||
      parsed.noExperienceRequired === undefined ||
      parsed.shortDescription === undefined
    ) {
      console.log('ai response incomplete\n');
      return null
    }
    return parsed; 
  } catch (e) {
    console.log('error while parsing response');
    return null;
  }
}