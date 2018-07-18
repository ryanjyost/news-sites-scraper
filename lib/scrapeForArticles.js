const puppeteer = require("puppeteer");
const to = require("./to.js");
const logMemoryUsage = require("./logMemoryUsage.js");
const scrape = require("./scrape.js");
const Article = require("../models/article.js");
const striptags = require("striptags");

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
        // date: Date.now(),
        guid: item.link,
        source: item.source
      })
    );

    if (err) console.error("Error saving to db", err);
  }

  //.....close Pupputeer
  await to(page.close());
  await to(browser.close());

  return feedText;
};
