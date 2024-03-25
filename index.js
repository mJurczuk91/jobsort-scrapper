import { parser } from "./src/scraper.js";

const array = parser.parsePracujpl().then(res => console.log(res.length));
