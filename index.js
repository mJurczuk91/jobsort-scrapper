import { scraper } from "./src/scraping/scraper.js";
import fs from 'fs'

/* const array = scraper.scrapeAll().then(data => {
    console.log(data.length);
    fs.appendFile("output.txt", JSON.stringify(data), (err) => {
        err && fs.appendFile("err.txt", JSON.stringify(err).concat(new Date().toLocaleDateString()), ()=>{})
    });
    return data;
});
 */

const offer = {
    "link": "https://www.pracuj.pl/praca/fullstack-developer-react%2bnode-warszawa,oferta,1003220785",
    "title": "Fullstack Developer (React+Node)",
    "description": "We are looking for a talented Fullstack Developer (React/Next/Node) to join our team and contribute to the development of a cutting-edge incentive project. As a Fullstack Developer, you will be responsible for building robust and scalable web applications that deliver personalized product recommendations to consumers. Our Partner is a global leader in consumer goods, known for iconic brands that touch lives and make everyday moments better. With a legacy of innovation and a commitment to excellence, they strive to create products that improve the lives of consumers around the world.Work mode: Hybrid (1 or 2 days a week from the office in Warsaw)",
    "technologies": [
        "React.js",
        "Node.js",
        "Microsoft Azure",
        "Google Cloud Platform",
        "GraphQL"
    ],
    "responsibilities": [
        "Design and develop frontend and backend components using React, Next.js, and Node.js",
        "Collaborate with cross-functional teams to implement user interfaces and application logic",
        "Integrate with databases, APIs, and third-party services to support dynamic content generation",
        "Optimize application performance and ensure responsiveness across various devices and browsers",
        "Write clean, maintainable code and adhere to best practices in software development"
    ],
    "requirements": [
        "Minimum of 3 years of professional experience in the relevant field (React+Node)",
        "Strong portfolio showcasing previous projects, especially those that introduced innovative features for recognized companies in the market",
        "Proven track record in defining coding standards for development teams",
        "Extensive experience in delivering applications with complex backend integrations",
        "Solid understanding of software engineering principles and agile methodologies",
        "Solid understanding of public cloud services (preferred Azure and/or GCP)",
        "Solid understanding of GraphQL (Apollo GraphQL platform preferred)",
        "Excellent team collaboration and problem solving skills",
        "Ability to train/coach more junior team members"
    ],
    "optionalRequirements": [
        "Azure or ideally GCP and Azure (multicloud expertise)"
    ],
    "offerValidDate": "",
    "isJuniorFriendly": "false",
    "noExperienceRequired": "false",
    "shortDescription": "Experienced Fullstack Developer (React + Node) required by a global leader in consumer goods."
};

const customHeaders = {
    "Content-Type": "application/json",
    "key": "asdasd",
};

const url = 'http://localhost:3010/offers';

fetch(url, {
    method: "POST",
    headers: customHeaders,
    body: JSON.stringify(offer),
})
    //.then((response) => response.json())
    .then((data) => {
        console.log(data);
});