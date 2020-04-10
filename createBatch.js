const puppeteer = require("puppeteer");
const Batch = require("./models/batch.js");
const AWS = require("aws-sdk");
const to = require("./lib/to.js");
const createRecord = require("./lib/createRecord.js");
// const sites = require("./sites");
const logMemoryUsage = require("./lib/logMemoryUsage.js");
const fs = require('fs')

/* Handles all screenshots and data scraping for all sites in a batch */
const createBatch = async () => {
  console.log(`###########################################################`);

  // declare vars for await to()
  let err, browser, page, result, batch;

  // create a timestamp for the new batch
  const batchTime = Date.now();
  console.log(`Starting Batch ${batchTime}... `);

  const pupConfig = {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ]
  };

  if (process.env.PUPPETEER_PATH) {
    pupConfig.executablePath = process.env.PUPPETEER_PATH;
  }

  console.log("Puppeteer Config", pupConfig);

  //.....launch headless chrome instance
  [err, browser] = await to(puppeteer.launch(pupConfig));
  if (err) console.error("Error", err);

  //.....create a new browser page
  [err, page] = await to(browser.newPage());
  if (err) console.error("Error", err);

  //.....increase default navigation timeout
  await page.setDefaultNavigationTimeout(10000);

  // build an array of record ids to store on the Batch when finished
  // pass this callback to createRecord() to add the new record's id to batch's array
  let recordIds = [];
  const addRecordInfoToBatch = function(id) {
    console.log("+ added id to batch array");
    recordIds.push(id);
  };

  const s3 = new AWS.S3();
  const params = {
    Bucket: "birdseyenews",
    Key: "sites.js",
    // Range: "bytes=0-9"
  };

  s3.getObject(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    const file = data.Body.toString('base64');
    fs.writeFile('siteList.js', file, {encoding: 'base64'}, async function(err) {

      const sites = require("./siteList.js");

      for (let site of sites) {
        if (site.name !== "bloomberg") {
          //.....create a single record
          let record;
          [err, record] = await to(
            createRecord(page, site, batchTime, addRecordInfoToBatch)
          );
          //logMemoryUsage();

          if (err) console.error("Error", err);
        }
      }

      //.....close Pupputeer
      await to(page.close());
      await to(browser.close());
    });
  });

  // create a new record for all sites
  // for (let site of sites) {
  //   if (site.name !== "bloomberg") {
  //     //.....create a single record
  //     let record;
  //     [err, record] = await to(
  //       createRecord(page, site, batchTime, addRecordInfoToBatch)
  //     );
  //     //logMemoryUsage();
  //
  //     if (err) console.error("Error", err);
  //   }
  // }
  //
  // [err, batch] = await to(
  //   Batch.create({
  //     id: batchTime,
  //     records: recordIds,
  //     // tags: topTags,
  //     completed_at: new Date()
  //   })
  // );

  // if (err) console.error("Error", err);
  //
  // if (batch) {
  //   console.log("***********************************************");
  //   console.log(
  //     `Batch ${batch.id} created with ${batch.records.length} records`
  //   );
  //   console.log(batch);
  //   console.log("***********************************************");
  // }
  //
  // //.....close Pupputeer
  // await to(page.close());
  // await to(browser.close());
};

module.exports = createBatch;
