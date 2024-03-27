import { delay } from "./lib.js";
import { VertexAI, HarmCategory, HarmBlockThreshold } from "@google-cloud/vertexai";

async function evaluateOffers(offers) {
  const offer = {
    "link": "https://www.pracuj.pl/praca/junior-full-stack-engineer-krakow,oferta,1003215864",
    "parsed": {
      "title": "Junior Full Stack Engineer",
      "description": "INK Solutions is a premier software development company dedicated to empowering businesses with innovative digital solutions. We specialize in creating custom software applications that streamline operations, enhance customer engagement, and drive growth. We are currently seeking a highly motivated Junior Full Stack Engineer to join our dynamic team and contribute to the expansion of our comprehensive suite of digital solutions.",
      "technologies": [
        "HTML",
        "CSS",
        "Python",
        "Java",
        "Node.js",
        "Git"
      ],
      "responsibilities": [
        "This position offers a unique opportunity to develop a broad range of skills in both front-end and back-end development, contribute to meaningful projects, and grow within a supportive and innovative environment. We look forward to welcoming talented and passionate individuals to our team."
      ],
      "requirements": [
        "A fundamental understanding of software development principles and the software development lifecycle is essential.",
        "Proficiency in front-end technologies such as HTML, CSS, JavaScript, and frameworks like React or Angular.",
        "Knowledge in back-end development, including experience with programming languages such as Python, Java, or Node.js, and familiarity with database management systems.",
        "Experience with version control systems, preferably Git.",
        "Basic understanding of RESTful APIs and web services.",
        "Ability to quickly learn new technologies and adapt to changing technical environments.",
        "Strong problem-solving skills and a commitment to delivering high-quality software solutions.",
        "Must be based in Poland or willing to relocate, as working from Poland is a requirement for this position."
      ],
      "optionalRequirements": []
    }
  };

  console.log(offer["parsed"]["requirements"]);

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

  const task = `You will get a programming job offer in a json format. Read it and respond with the following information in json format: 
  isJuniorFriendly - true or false depending on your evaluation of the offer, if the offer requires a year or less of experience consider it a junior friendly job, 
  noExperienceRequired - true or false true if the offer requires none or minimal experience,
  shortDescription: a short description of the offer`;

  async function streamGenerateContent() {
    const request = {
      contents: [{ role: 'user', parts: [
        { text: `${task}. Offer: ${JSON.stringify(offer)}`},
      ]}],
    };
    const streamingResp = await generativeModel.generateContentStream(request);
    //JSON.stringify(await streamingResp.response)
    const textArray = (await streamingResp.response).candidates[0].content.parts[0].text.split('\n').slice(1, 6);
    const isJuniorFriendly = textArray[1].split(':')[1].trim().split(',')[0];
    const noExperienceRequired = textArray[2].split(':')[1].trim().split(',')[0];
    const shortDescription = textArray[3].split(':')[1].trim();
    console.log(isJuniorFriendly);
  };

  streamGenerateContent();

  await delay(600000);
}

evaluateOffers('asd');