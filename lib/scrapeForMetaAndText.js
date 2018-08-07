const sites = require("../sites");
const to = require("./to.js");
const cheerio = require("cheerio");
const request = require("request");
const metascraper = require("metascraper");
const got = require("got");

module.exports = async function(targetUrl) {
  const { body: html, url } = await got(targetUrl);
  const metadata = await metascraper({ html, url });

  const $ = cheerio.load(html);
  // console.log($(".pg-headline").text());
  console.log("========================================");
  console.log($(".zn-body-text").text());

  return $(".pg-headline").text();
};
