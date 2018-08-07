const sites = require("../sites.js");
const Round = require("../models/round.js");
const to = require("./to.js");
const gramophone = require("gramophone");

const handleSingleFeed = require("./handleSingleFeed");
const scrapeForArticles = require("./scrapeForArticles");

module.exports = async () => {
  console.log(`###########################################################`);
  // get timestamp
  const roundTime = Date.now();
  console.log(`Starting Round ${roundTime}... `);

  // get all RSS feed data
  for (let site of sites) {
    console.log(`=================================`);
    console.log(site.name);
    for (let source of site.rss) {
      let err, results;

      if (source.type === "rss") {
        [err, results] = await to(handleSingleFeed(source, site, roundTime));
      } else if (source.type === "scrape") {
        [err, results] = await to(scrapeForArticles(source, site, roundTime));
      }

      if (err) console.error("Error", err);
    }
  }

  // console.log("TOP TAGS", topTags);

  // let err, round;
  // Round.create(
  //   {
  //     round: roundTime,
  //     tags: topTags,
  //     completed_at: new Date()
  //   },
  //   function(err, round) {
  //     if (err) console.error("Error", err);
  //     if (round) {
  //       console.log("***********************************************");
  //       console.log(`Round ${round.id} created`);
  //       console.log(round);
  //       console.log("***********************************************");
  //     }
  //   }
  // );
  //
  // if (round) {
  //   console.log("***********************************************");
  //   console.log(`Round ${round.id} created `);
  //   console.log(round);
  //   console.log("***********************************************");
  // }
  console.log("DONE");
};
