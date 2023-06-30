//const puppeteer = require('puppeteer');
import * as puppeteer from 'puppeteer';

const getSemaSchedule = async function () {
    const browser = await puppeteer.launch(
        {headless: false,
         // slowMo: 100,
        }
    );
    const page = await browser.newPage();

    await page.goto('https://sema.seoul.go.kr/kr/whatson/landing');

    await page.waitForSelector("#contents"); // wait for the selector

    // submit form and wait for navigation to a new page
    await Promise.all([
        page.click("#whereChoice1"),
    ]);
    await Promise.all([
        page.click("#whereChoice3"),
        page.click("#whatChoice2"),
        page.click("#whatChoice3"),
        page.click("#schSubmit"),
        await page.waitForNavigation(),
    ]);
  
    await page.waitForSelector("#contents");
    
    const exhibitInfo = await page.$$eval('.c-connected > div > a > div.t-metadata.o_figcaption', 
        (lists => 
            // except all time exhibit
            lists.filter(list => {
                const schedule = list.querySelector("span.o_h3");
                if(schedule.innerText.split("~").length > 1){
                    return list;
                } 
            }).map( list => {
                const name = list.querySelector("strong.o_h1");
                const schedule = list.querySelector("span.o_h3");
                return {
                    name: name.innerText,
                    schedule: schedule.innerText
                }
            })
        )
    );
    await browser.close();
    return exhibitInfo;
};
const SemaSchedule = await getSemaSchedule();


export {SemaSchedule};