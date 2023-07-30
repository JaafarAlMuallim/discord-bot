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
function getExams() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: "new",
        });
        const page = yield browser.newPage();
        yield page.goto("https://registrar.kfupm.edu.sa/exams-grades/final-exam-schedule/");
        yield page.select("#term_option", "202230");
        yield page.waitForSelector("div > #data-table");
        const mainData = yield page.evaluate(() => {
            const trs = Array.from(document.querySelectorAll("div div table tr"));
            const data = [];
            for (let i = 1; i < trs.length; i++) {
                const tds = trs[i].querySelectorAll("td");
                const courseId = tds[0].innerText;
                const courseName = tds[1].innerText;
                const time = tds[2].innerText;
                const date = tds[3].innerText;
                const day = tds[4].innerText;
                const location = tds[5].innerText;
                const dataObj = {
                    courseId: courseId,
                    courseName,
                    time: time,
                    date,
                    day,
                    location,
                };
                data.push(dataObj);
            }
            return data;
        });
        yield browser.close();
        return { exams: mainData };
    });
}
exports.default = getExams;
