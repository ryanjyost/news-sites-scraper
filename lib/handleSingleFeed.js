// 3rd party
const FeedParser = require("feedparser");
const request = require("request"); // for fetching the feed
const striptags = require("striptags");
const ogs = require("open-graph-scraper");
// const natural = require("natural");
// const stopWords = require("stopwords").english;
// const customSentiment = require("../data/customSentiment.json");

// models
const Article = require("../models/article.js");

//helpers
const logMemoryUsage = require("./logMemoryUsage");
const to = require("./to.js");

// NATURAL
// const Analyzer = require("natural").SentimentAnalyzer;
// const stemmer = require("natural").PorterStemmer;
// const AFINNAnalyzer = new Analyzer("English", stemmer, "afinn");
// const SenticonAnalyzer = new Analyzer("English", stemmer, "senticon");
// const PatternAnalyzer = new Analyzer("English", stemmer, "pattern");

// SENTIMENT
// var Sentiment = require("sentiment");
// var SentimentAnalyzer = new Sentiment();

module.exports = async function(source, site, round) {
  const req = request(source.url);
  const feedparser = new FeedParser({ normalize: true });

  let resolveUpload, rejectUpload;
  const waitForUploadResponse = () => {
    return new Promise((resolve, reject) => {
      resolveUpload = resolve;
      rejectUpload = reject;
    });
  };

  req.on("error", function(error) {
    // handle any request errors
    console.log(`!!! Error requesting rss feed ${source.url}`);
    resolveUpload("");
  });

  req.on("response", function(res) {
    const stream = this; // `this` is `req`, which is a stream

    if (res.statusCode !== 200) {
      this.emit("error", new Error("Bad status code"));
    } else {
      stream.pipe(feedparser);
    }
  });

  feedparser.on("error", function(error) {
    rejectUpload(err);
    console.log("Error");
  });

  let feedText = [];
  feedparser.on("readable", async function() {
    // This is where the action is!
    const stream = this; // `this` is `feedparser`, which is a stream
    // **NOTE** the "meta" is always available in the context of the feedparser instance
    let item, tokenizedText;

    // console.log(meta);
    while ((item = stream.read()) && feedText.length < 11) {
      // add headlines to group of text to get top news

      if (item.title.includes("WATCH:")) {
        console.log("REMOVE");
        item.title = item.title.replace("WATCH:", "");
      }

      feedText.push(item.title);

      /*=================================================================================*/
      let resolveOG, rejectOG;
      const waitForOG = () => {
        return new Promise((resolve, reject) => {
          resolveOG = resolve;
          rejectOG = reject;
        });
      };

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

      let ogResponse, err;
      if (!item.image.length) {
        [err, ogResponse] = await to(waitForOG());
      }

      /*=================================================================================*/

      let article;
      [err, article] = await to(
        Article.create({
          category: source.category,
          round: round,
          site: site,
          siteName: site.name,
          title: item.title,
          summary: striptags(item.summary)
            .replace(/\r?\n|\r/g, " ")
            .trim(),
          description: striptags(item.description)
            .replace(/\r?\n|\r/g, " ")
            .trim(),
          link: item.link,
          origLink: item.origLink,
          permaLink: item.permaLink,
          date: item.date,
          pubate: item.pubdate,
          author: item.author,
          guid: item.guid,
          categories: item.categories,
          source: item.source,
          image: ogResponse ? ogResponse : item.image
        })
      );

      if (err) console.error("Error saving to db - likely duplicate");

      if (article) {
        console.log(`${site.name} > ${article.category} : ${article.title}`);
      }
    }
  });

  feedparser.on("end", function() {
    resolveUpload(feedText);
  });

  let result, err;
  [err, result] = await to(waitForUploadResponse());
  if (result) {
    return result;
  }
};
