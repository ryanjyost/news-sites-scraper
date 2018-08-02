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

  let arraysOfHeadlines = [];

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
      arraysOfHeadlines.push(results);
    }
  }

  // build flat array of headlines
  let flatArray = [].concat.apply([], arraysOfHeadlines);
  console.log("FLAT ARRAY", flatArray);

  const frequencies = gramophone.extract(flatArray.join(" "), {
    score: true,
    limit: 30,
    stem: true
  });

  const topTags = frequencies.filter(tag => {
    const termArray = tag.term.split(" ");
    let tooShort = false;
    if (termArray.length > 1) {
      tooShort = termArray.find(term => {
        return term.length < 2;
      });
    } else {
      tooShort = tag.term.length < 4;
    }

    let termsToSkip = ["make", "report", "close", "this", "call"];
    if (tooShort) {
      return false;
    } else if (termsToSkip.includes(tag.term.toLowerCase())) {
      return false;
    } else {
      return tag.tf >= 5;
    }
  });

  // console.log("TOP TAGS", topTags);

  let err, round;
  Round.create(
    {
      round: roundTime,
      tags: topTags,
      completed_at: new Date()
    },
    function(err, round) {
      if (err) console.error("Error", err);
      if (round) {
        console.log("***********************************************");
        console.log(`Round ${round.id} created`);
        console.log(round);
        console.log("***********************************************");
      }
    }
  );

  if (round) {
    console.log("***********************************************");
    console.log(`Round ${round.id} created `);
    console.log(round);
    console.log("***********************************************");
  }
  console.log("DONE");
};
