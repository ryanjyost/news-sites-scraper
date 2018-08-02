const sites = require("../sites");
const to = require("./to.js");
const cheerio = require("cheerio");
const request = require("request");
const metascraper = require("metascraper");
const got = require("got");

module.exports = async function() {
  console.log("==========================");
  const targetUrl =
    "https://www.cnn.com/2018/07/28/politics/eric-holder-interested-in-being-president/index.html";

  const { body: html, url } = await got(targetUrl);
  const metadata = await metascraper({ html, url });

  const $ = cheerio.load(html);
  console.log($(".pg-headline").text());

  return 1;
};
