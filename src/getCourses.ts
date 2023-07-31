import { Course } from "./dataModel";
import puppeteer from "puppeteer";

export default async function getCourses(code: string) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto(
    "https://registrar.kfupm.edu.sa/courses-classes/course-offering1/"
  );
  await page.select("#term_code", "202310");
  await page.select("#dept_code", code);
  await page.waitForSelector("table");
  const mainData = await page.evaluate(() => {
    const trs: HTMLDataElement[] = Array.from(
      document.querySelectorAll("div div table tr")
    );
    const data: Course[] = [];
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
      const dataObj: Course = {
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

  await browser.close();
  return { courses: mainData };
}
