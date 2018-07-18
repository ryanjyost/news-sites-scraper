const puppeteer = require("puppeteer");
const gramophone = require("gramophone");

const Batch = require("./models/batch.js");

const to = require("./lib/to.js");
const createRecord = require("./lib/createRecord.js");
const sites = require("./sites");
const logMemoryUsage = require("./lib/logMemoryUsage.js");

/* Handles all screenshots and data scraping for all sites in a batch */
const createBatch = async () => {
  console.log(`###########################################################`);

  // declare vars for await to()
  let err, browser, page, result, batch;

  // create a timestamp for the new batch
  const batchTime = Date.now();
  console.log(`Starting Batch ${batchTime}... `);

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
  await page.setDefaultNavigationTimeout(60000);

  // build an array of record ids to store on the Batch when finished
  // pass this callback to createRecord() to add the new record's id to batch's array
  let recordIds = [];
  const addRecordInfoToBatch = function(id) {
    console.log("+ added id to batch array");
    recordIds.push(id);
  };

  // get common words to add to batch
  let combinedText = "";
  function addRecordToWordTracking(record, site) {
    if (record) {
      const links = record.content.links;

      for (let link of links) {
        let string = link.text;
        //let cleanString = string.replace(/[,\/#!$%\^&\*;:{}=_`~()]/g, "");
        combinedText = combinedText + " " + string;
      }
    } else {
      console.log("!!!WORD TRACKING FAILED", site);
    }
  }

  // create a new record for all sites
  for (let site of sites) {
    //.....create a single record
    let record;
    [err, record] = await to(
      createRecord(page, site, batchTime, addRecordInfoToBatch)
    );
    addRecordToWordTracking(record, site);
    logMemoryUsage();

    //console.log('Memory Usage', 'RSS:', usage);
    if (err) console.error("Error", err);
  }

  const frequencies = gramophone.extract(combinedText, {
    score: true,
    limit: 30
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

    if (tooShort) {
      return false;
    } else {
      return tag.tf >= 5;
    }
  });

  [err, batch] = await to(
    Batch.create({
      id: batchTime,
      records: recordIds,
      tags: topTags,
      completed_at: new Date()
    })
  );

  if (err) console.error("Error", err);

  if (batch) {
    console.log("***********************************************");
    console.log(
      `Batch ${batch.id} created with ${batch.records.length} records`
    );
    console.log(batch);
    console.log("***********************************************");
  }

  //.....close Pupputeer
  await to(page.close());
  await to(browser.close());
};

module.exports = createBatch;
