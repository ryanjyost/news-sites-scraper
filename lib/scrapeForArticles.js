const puppeteer = require("puppeteer");
const to = require("./to.js");
const logMemoryUsage = require("./logMemoryUsage.js");
const scrape = require("./scrape.js");
const Article = require("../models/article.js");
const striptags = require("striptags");
const ogs = require("open-graph-scraper");

module.exports = async (source, site, round) => {
  // declare vars for await to()
  let err, browser, page, scrapedData;

  //.....launch headless chrome instance
  [err, browser] = await to(
    puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    })
  );
  if (err) console.error("Error", err);

  function handleClose(msg) {
    console.log(msg);
    page.close();
    browser.close();
    // process.exit(1);
  }

  process.on("uncaughtException", () => {
    handleClose(`I crashed`);
  });

  process.on("unhandledRejection", () => {
    handleClose(`I was rejected`);
  });

  //.....create a new browser page
  [err, page] = await to(browser.newPage());
  if (err) console.error("Error", err);

  //.....increase default navigation timeout
  await page.setDefaultNavigationTimeout(10000);

  //.....nav to site
  [err] = await to(page.goto(source.url, { waitUntil: "networkidle0" }));
  if (err) console.error("Error", err);

  //.....scrape page for top 10 links
  [err, scrapedData] = await to(scrape(page, site, source));
  if (err) console.error("Error", err);

  let feedText = [];
  for (let item of scrapedData.links) {
    let textForGramophone = "";

    if ("description" in item) {
      textForGramophone = striptags(item.title + ". " + item.description);
    } else {
      textForGramophone = striptags(item.title);
    }

    feedText.push(textForGramophone);

    /*=================================================================================*/

    let resolveOG, rejectOG;
    const waitForOG = () => {
      return new Promise((resolve, reject) => {
        resolveOG = resolve;
        rejectOG = reject;
      });
    };

    let ogResponse, err;

    let options = { url: item.link };
    ogs(options, function(error, results) {
      if (error) {
        console.log("error with OG");
        rejectOG(err);
      } else {
        console.log("Image saved through OG");
        resolveOG(results.data.ogImage);
      }
    });

    [err, ogResponse] = await to(waitForOG());

    /*=================================================================================*/

    let article;
    [err, article] = await to(
      Article.create({
        category: source.category,
        round: round,
        site: site,
        siteName: site.name,
        title: item.title,
        summary: item.description
          ? striptags(item.description)
              .replace(/\r?\n|\r/g, " ")
              .trim()
          : "",
        description: item.description
          ? striptags(item.description)
              .replace(/\r?\n|\r/g, " ")
              .trim()
          : "",
        link: item.link,
        origLink: item.link,
        permaLink: item.link,
        guid: item.link,
        source: item.source,
        image: ogResponse ? ogResponse : ""
      })
    );

    if (err) console.error("Error saving to db", err);
  }

  //.....close Pupputeer
  await to(page.close());
  await to(browser.close());

  return feedText;
};
