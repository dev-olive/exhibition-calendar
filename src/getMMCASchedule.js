import * as puppeteer from 'puppeteer';

const getMMCASchedule = async function(){
    const browser = await puppeteer.launch(
        {headless: false,
         // slowMo: 100,
        }
    );

    const page = await browser.newPage();
    await page.goto('https://www.mmca.go.kr/exhibitions/progressList.do');
    await page.waitForSelector("#content");

    await Promise.all([
        page.click("#exhPlaCdHtmlArea li:nth-child(2)"),
        // await page.waitForNavigation(),
    ])
    await page.waitForSelector("#content");

    const exhibitInfo = await page.$$eval('#listDiv > ul > li > a > .info', 
        (lists => 
            // except all time exhibit
            lists.map( list => {
                const name = list.querySelector(".tit");
                const schedule = list.querySelector(".txt");
                return {
                    name: name.innerText,
                    schedule: schedule.innerText
                }
            })
        )
    );
    console.log(exhibitInfo);
    // await browser.close();
    return exhibitInfo;
}

const MMCASchedule = await getMMCASchedule();

export {MMCASchedule};
