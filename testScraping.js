const puppeteer = require("puppeteer");
const sites = require("./sites");
const to = require("./lib/to.js");

(async () => {
  try {
    const site = sites[0];
    console.log("start scraping", site.name);

    // declare vars for await to()
    let err, browser, page, $linkObjects;

    // launch headless chrome instance
    [err, browser] = await to(puppeteer.launch({ headless: true }));
    if (err) console.error("Error", err);

    // create a new browser page
    [err, page] = await to(browser.newPage());
    if (err) console.error("Error", err);

    // nav to site
    [err] = await to(page.goto(site.url, { waitUntil: "networkidle2" }));
    if (err) console.error("Error", err);

    [$err, $linkObjects] = await to(
      page.evaluate(() => {
        // =============================================================
        // CHANGE THINGS IN HERE
        // =============================================================

        const titles = Array.from(document.querySelectorAll("h3 a"));

        let top10 = [];

        for (let title of titles) {
          if (top10.length >= 10) {
            break;
          } else {
            const anchor = title.closest("a");
            top10.push({ text: title.textContent.trim(), href: title.href });

            // top10.push({ text: title.textContent.trim() });
          }
        }

        return top10;
        // return document.querySelector("body");
        // =============s================================================
        // CHANGE THINGS IN HERE
        // =============================================================
      })
      // page.content()
    );

    console.dir($linkObjects);
    await browser.close();
  } catch (e) {
    console.log("ERROR", e);
    await browser.close();
  }
})();
