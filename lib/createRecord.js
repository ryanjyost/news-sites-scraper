const cloudinary = require("cloudinary");
const scrape = require("./scrape.js");
const to = require("./to.js");
const prepPageForScreenshot = require("./prepPageForScreenshot.js");
const intoStream = require("into-stream");
const Record = require("../models/record.js");
const AWS = require("aws-sdk");

cloudinary.config({
  cloud_name: "ryanjyost",
  api_key: "737735696923524",
  api_secret: "-jRo4mZuCiGDIMMQq2ghIr2rDn4"
});

module.exports = async function(page, site, batchTime, mongodbCallback) {
  console.log(`+++++++++++ Creating new record for ${site.name} +++++++++++`);
  let err,
    result,
    screenshot,
    scrapedData,
    streamResult,
    record,
    cloudinaryResult;

  //.....nav to site
  [err] = await to(page.goto(site.url, { waitUntil: "networkidle0" }));
  if (err) console.error("Error", err);

  //.....scrape page for top 10 links
  [err, scrapedData] = await to(scrape(page, site));
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

  const readable = intoStream(screenshot);

  let resolveUpload, rejectUpload;
  const waitForUploadResponse = () => {
    return new Promise((resolve, reject) => {
      resolveUpload = resolve;
      rejectUpload = reject;
    });
  };

  const Key = `${site.name}/${site.name}_${batchTime}`;
  const fileName = `${site.name}/${site.name}_${batchTime}`;

  const objectParams = {
    Bucket: "birdseyenews",
    Key,
    Body: readable
  };

  const s3 = new AWS.S3();

  s3.upload(objectParams, {}, function(err, data) {
    if (err) {
      console.log(`!!Error uploading ${site.name} to aws!!`);
      console.log(err);
      rejectUpload(err);
      return;
    }

    console.log(`+ ${site.name} uploaded to bucket`);
    resolveUpload(data);
  });

  // upload file
  // await readable.pipe(awsStream);
  let awsResponse;
  [err, awsResponse] = await to(waitForUploadResponse());

  [err, record] = await to(
    Record.create({
      // uploaded_at: cloudinaryResult.created_at,
      batch: batchTime,
      site: site,
      image: awsResponse.Key,
      content: {
        links: scrapedData ? scrapedData.links : []
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
