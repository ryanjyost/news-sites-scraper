const puppeteer = require("puppeteer");
const sites = require("./sites");
const to = require("./lib/to.js");
const Timeout = require("await-timeout");

(async () => {
  try {
    const site = sites[0];
    console.log("start screenshotting", site.name);

    // declare vars for await to()
    let err, browser, page, $linkObjects, selector, ad;

    const timeout = ms => new Promise(res => setTimeout(res, ms));

    // launch headless chrome instance
    let headless = true;

    if (site.name === "washpo") {
      headless = false;
    }
    [err, browser] = await to(
      puppeteer.launch({
        headless: true
      })
    );
    if (err) console.error("Error", err);

    // create a new browser page
    [err, page] = await to(browser.newPage());
    if (err) console.error("Error", err);

    // nav to site
    [err] = await to(page.goto(site.url, { waitUntil: "networkidle2" }));
    if (err) console.error("Error", err);

    // set screen to standard laptop
    await page.setViewport({
      width: Math.floor(1024),
      height: Math.floor(1024)
    });
    if (err) console.error("Error", err);

    /* ===================================== */
    /* Prep Page For Screenshot */

    // [$err, selector] = await to(page.$(".pb-container"));
    // // // console.log("PREP!");

    // // // if ($err) console.error("Error", err);

    // if (selector) {
    //   // console.log("scroll1");
    //   await page.evaluate(thing => {
    //     window.scrollBy(0, thing.offsetTop);
    //     return window.pageYOffset;
    //   }, selector);
    // }

    // [$err, ad] = await to(page.$(".l-hp-b-top__ad--full"));

    // if (ad) {
    //   await page.evaluate(thing => {
    //     thing.style.display = "none";
    //     return thing;
    //   }, ad);
    // }

    /* ===================================== */

    // await timeout(15000);
    await page.screenshot({ path: "example.jpeg" });

    await page.close();
    await browser.close();
  } catch (e) {
    console.log("ERROR", e);
    await browser.close();
  }
})();
