const cloudinary = require("cloudinary");
const puppeteer = require("puppeteer");
const intoStream = require("into-stream");
const gramophone = require("gramophone");

const Record = require("./models/record.js");
const Batch = require("./models/batch.js");

const to = require("./lib/to.js");
const prepPageForScreenshot = require("./lib/prepPageForScreenshot.js");
const scrape = require("./lib/scrape.js");
const sites = require("./sites");
const logMemoryUsage = require("./lib/logMemoryUsage.js");

cloudinary.config({
  cloud_name: "ryanjyost",
  api_key: "737735696923524",
  api_secret: "-jRo4mZuCiGDIMMQq2ghIr2rDn4"
});

/* Scrape site data */
const scrapeData = async function(page, site) {
  let arrayOfLinkObjects = [];

  //.....get data to save in mongodb record
  [err, arrayOfLinkObjects] = await to(scrape(page, site));
  if (err) console.error("Error!");

  console.log(`+ Scraped and saved ${arrayOfLinkObjects.length} links`);
  return { links: arrayOfLinkObjects };
};

/* Create Record */
const createRecord = async function(page, site, batchTime, mongodbCallback) {
  console.log(`+++++++++++ Creating new record for ${site.name} +++++++++++`);
  let err, result, screenshot, data, streamResult, record, cloudinaryResult;

  //.....nav to site
  [err] = await to(page.goto(site.url, { waitUntil: "networkidle0" }));
  if (err) console.error("Error", err);

  //.....scrape page for top 10 links
  [err, data] = await to(scrapeData(page, site));
  //logMemoryUsage();

  //.....set screen to standard laptop
  [err] = await to(
    page.setViewport({
      width: Math.floor(1024),
      height: Math.floor(1024)
    })
  );
  if (err) console.error("Error", err);

  //.....prep the page for the screenshot
  [err] = await to(prepPageForScreenshot(page, site));

  //.....take screenshot
  [err, screenshot] = await to(page.screenshot({ type: "jpeg" }));
  if (err) console.error("Error", err);
  //console.log("screenshot", screenshot);

  const readable = intoStream(screenshot);

  // need to resolve promise with the cloudinary result from the stream callback
  let resolveCloudinary, rejectCloudinary;

  const waitForCloudinaryResponse = () => {
    let cloudinaryPromise = new Promise((resolve, reject) => {
      resolveCloudinary = resolve;
      rejectCloudinary = reject;
    });

    return cloudinaryPromise;
  };

  const cloudinaryStream = cloudinary.v2.uploader.upload_stream(
    {
      public_id: `${site.name}/${site.name}_${batchTime}`
    },
    (err, result) => {
      if (err) {
        console.log(`!!Error uploading ${site.name} to cloudinary!!`);
        console.log(err);
        rejectCloudinary(err);
        return;
      }

      console.log(`+ ${site.name} uploaded to cloudinary`);
      resolveCloudinary(result);
    }
  );

  // upload file
  await readable.pipe(cloudinaryStream);
  [err, cloudinaryResult] = await to(waitForCloudinaryResponse());
  console.log("uploading");
  //logMemoryUsage();

  // save to mongodb
  [err, record] = await to(
    Record.create({
      uploaded_at: cloudinaryResult.created_at,
      batch: batchTime,
      site: site,
      image: {
        url: cloudinaryResult.url,
        secure_url: cloudinaryResult.secure_url
      },
      content: {
        links: data.links
      }
    })
  );

  if (err) console.error("Error", err);

  if (record) {
    console.log(`+ ${record.site.title} saved to mongodb`);
    mongodbCallback(record.id);
    return record;
  }
};

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
      tags: topTags
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
