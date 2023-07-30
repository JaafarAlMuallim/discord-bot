import { Data } from "./dataModel";
import puppeteer from "puppeteer";
import { sortByDateAndTime } from "./utils";

export default async function getExams() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto(
    "https://registrar.kfupm.edu.sa/exams-grades/final-exam-schedule/"
  );
  await page.select("#term_option", "202230");
  await page.waitForSelector("div > #data-table");
  const mainData = await page.evaluate(() => {
    const trs: HTMLDataElement[] = Array.from(
      document.querySelectorAll("div div table tr")
    );
    const data: Data[] = [];
    for (let i = 1; i < trs.length; i++) {
      const tds = trs[i].querySelectorAll("td");
      const courseId = tds[0].innerText;
      const courseName = tds[1].innerText;
      const time = tds[2].innerText;
      const date = tds[3].innerText;
      const day = tds[4].innerText;
      const location = tds[5].innerText;
      const dataObj: Data = {
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

  await browser.close();
  return { exams: mainData };
}
