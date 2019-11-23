const to = require("./to.js");
const prepPageForScreenshot = require("./prepPageForScreenshot.js");
const intoStream = require("into-stream");
const Record = require("../models/record.js");
const AWS = require("aws-sdk");

module.exports = async function(page, site, batchTime, mongodbCallback) {
  console.log(`+++++++++++ Creating new record for ${site.name} +++++++++++`);
  let err, screenshot, record, pageText;

  //.....nav to site
  [err] = await to(page.goto(site.url, { waitUntil: "networkidle0" }));
  if (err) console.error("Error", err);

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
  if (err) console.error("Error", err);

  //.....take screenshot
  [err, screenshot] = await to(page.screenshot({ type: "jpeg" }));
  if (err) console.error("Error", err);

  //.....get text on page
  [err, pageText] = await to(page.evaluate(() => document.body.innerText));
  console.log("PAGE TEXT", pageText);

  const readable = intoStream(screenshot);

  let resolveUpload, rejectUpload;
  const waitForUploadResponse = () => {
    return new Promise((resolve, reject) => {
      resolveUpload = resolve;
      rejectUpload = reject;
    });
  };

  const Key = `${site.name}/${site.name}_${batchTime}`;

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
  let awsResponse;
  [err, awsResponse] = await to(waitForUploadResponse());

  [err, record] = await to(
    Record.create({
      batch: batchTime,
      site: site,
      image: awsResponse.Key,
      text: pageText,
      text_lower: pageText.toLowerCase()
    })
  );

  if (err) console.error("Error", err);

  if (record) {
    console.log(`+ ${record.site.title} saved to mongodb`);
    mongodbCallback(record.id);
    return record;
  }
};
