const sites = require("../sites.js");
const Round = require("../models/round.js");
const Article = require("../models/article.js");
const BatchOfTags = require("../models/batchOfTags.js");
const to = require("./to.js");
const gramophone = require("gramophone");
const striptags = require("striptags");

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

  /* ================================================ */
  let politicsArticles = [];

  for (let site of sites) {
    let hasPolitics = site.rss.find(feed => {
      return feed.category === "politics";
    });
    if (hasPolitics) {
      let params = {
        siteName: site.name,
        category: "politics",
        created_at: {
          $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000)
        }
      };

      let articles = await Article.find(
        params,
        {},
        { sort: { created_at: -1 } },
        function(err, articles) {
          return articles;
        }
      ).limit(10);

      politicsArticles = politicsArticles.concat(articles);
    }
  }

  let opinionArticles = [];

  for (let site of sites) {
    let hasOpinions = site.rss.find(feed => {
      return feed.category === "opinion";
    });
    if (hasOpinions) {
      let params = { siteName: site.name, category: "opinion" };
      let articles = await Article.find(
        params,
        {},
        { sort: { created_at: -1 } },
        function(err, articles) {
          return articles;
        }
      ).limit(10);

      opinionArticles = opinionArticles.concat(articles);
    }
  }

  const filterTags = tag => {
    const termArray = tag.term.split(" ");
    let tooShort = false;
    if (termArray.length > 1) {
      tooShort = termArray.find(term => {
        return term.length < 2;
      });
    } else {
      tooShort = tag.term.length < 4;
    }

    if (tooShort) {
      return false;
    } else if (termsToSkip.includes(tag.term.toLowerCase())) {
      return false;
    } else {
      return tag.tf >= 5;
    }
  };

  const getTopTagsFromText = (text, min = 5) => {
    const combinedFrequencies = gramophone.extract(text, {
      score: true,
      min: min,
      stem: false,
      stopWords: termsToSkip
    });

    return combinedFrequencies.filter(filterTags);
  };

  let combinedText = "",
    politicsText = "",
    opinionText = "";

  for (let article of politicsArticles) {
    combinedText = combinedText + " " + striptags(article.title.trim());
    politicsText = politicsText + " " + striptags(article.title.trim());
  }

  for (let article of opinionArticles) {
    combinedText = combinedText + " " + striptags(article.title.trim());
    opinionText = opinionText + " " + striptags(article.title.trim());
  }

  let termsToSkip = ["make", "report", "close", "this", "call", "president"];

  const topTagsCombined = getTopTagsFromText(combinedText);
  const topTagsPolitics = getTopTagsFromText(politicsText);
  const topTagsOpinion = getTopTagsFromText(opinionText);

  let combinedArticles = [...politicsArticles, ...opinionArticles];
  for (let tag of topTagsCombined) {
    // console.log(combinedArticles.length);
    let combinedText = "",
      articleCount = 0;
    combinedArticles.map(article => {
      // console.log(article.title);
      if (article.title.toLowerCase().includes(tag.term)) {
        combinedText = combinedText + " " + striptags(article.title.trim());
        articleCount++;
      }
    });

    const tags = getTopTagsFromText(combinedText, 3);
    tag.related = tags || [];
    tag.sourceCount = articleCount;
  }

  // const politicsFrequencies = gramophone.extract(politicsText, {
  //   score: true,
  //   min: 5,
  //   stem: false,
  //   stopWords: termsToSkip
  // });
  // const topTagsPolitics = politicsFrequencies.filter(filterTags);
  //
  // const opinionFrequencies = gramophone.extract(opinionText, {
  //   score: true,
  //   min: 5,
  //   stem: false,
  //   stopWords: termsToSkip
  // });
  // const topTagsOpinion = opinionFrequencies.filter(filterTags);

  let err, batchOfTags;
  BatchOfTags.create(
    {
      round: roundTime,
      tags: topTagsCombined,
      politicsTags: topTagsPolitics,
      opinionTags: topTagsOpinion,
      sourceCount: combinedArticles.length
    },
    function(err, batch) {
      if (err) console.error("Error", err);
      if (batch) {
        console.log("***********************************************");
        console.log(`Batch Of Tags ${batch.id} created`);
        console.log(batch);
        console.log("***********************************************");
      }
    }
  );

  console.log("DONE");
};
