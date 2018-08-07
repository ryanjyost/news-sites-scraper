// 3rd party
const FeedParser = require("feedparser");
const request = require("request"); // for fetching the feed
const scrapeForMetaAndText = require("./scrapeForMetaAndText");

// models
const Article = require("../models/article.js");

//helpers
const logMemoryUsage = require("./logMemoryUsage");
const to = require("./to.js");

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
      /*=================================================================================*/
      let resolveOG, rejectOG;
      const waitForOG = () => {
        return new Promise((resolve, reject) => {
          resolveOG = resolve;
          rejectOG = reject;
        });
      };

      let text, err;
      [err, text] = await to(scrapeForMetaAndText(item.guid));
    }
  });

  feedparser.on("end", function() {
    resolveUpload([]);
  });

  let result, err;
  [err, result] = await to(waitForUploadResponse());
  if (result) {
    return result;
  }
};
