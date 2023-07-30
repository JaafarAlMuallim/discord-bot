"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
function getCourses(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: "new",
        });
        const page = yield browser.newPage();
        yield page.goto("https://registrar.kfupm.edu.sa/courses-classes/course-offering1/");
        yield page.select("#term_code", "202310");
        yield page.select("#dept_code", code);
        yield page.waitForSelector("table");
        yield page.screenshot({ path: "example.png" });
        const mainData = yield page.evaluate(() => {
            const trs = Array.from(document.querySelectorAll("div div table tr"));
            const data = [];
            for (let i = 1; i < trs.length; i++) {
                const tds = trs[i].querySelectorAll("td");
                const courseSec = tds[0].innerText;
                const activity = tds[1].innerText;
                const CRN = tds[2].innerText;
                const courseName = tds[3].innerText;
                const instructor = tds[4].innerText;
                const day = tds[5].innerText;
                const time = tds[6].innerText;
                const location = tds[7].innerText;
                const status = tds[8].innerText;
                const waitlist = tds[9].innerText;
                const dataObj = {
                    courseSec: courseSec,
                    activity,
                    crn: CRN,
                    courseName,
                    instructor,
                    day,
                    time,
                    location,
                    status,
                    waitlist,
                };
                data.push(dataObj);
            }
            return data;
        });
        yield browser.close();
        return { courses: mainData };
    });
}
exports.default = getCourses;
