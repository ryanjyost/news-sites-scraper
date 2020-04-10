const to = require("./to.js");
const prepPageForScreenshot = require("./prepPageForScreenshot.js");
const intoStream = require("into-stream");
const Record = require("../models/record.js");
const AWS = require("aws-sdk");

module.exports = async function(page, site, batchTime, mongodbCallback) {
  try {

    console.log(`+++++++++++ Creating new record for ${site.name} +++++++++++`);
    let err, screenshot, record, pageText;

    //.....nav to site
    [err] = await to(page.goto(site.url, {waitUntil: "networkidle0"}));
    if (err) console.error("Error", err);

    //.....set screen to standard laptop
    [err] = await to(
      page.setViewport({
        width: Math.floor(1024),
        height: Math.floor(1024 * 2)
      })
    );
    if (err) console.error("Error", err);

    //.....prep the page for the screenshot
    [err] = await to(prepPageForScreenshot(page, site));
    if (err) console.error("Error", err);

    //.....take screenshot
    [err, screenshot] = await to(page.screenshot({type: "jpeg"}));
    if (err) console.error("Error", err);

    //.....get text on page
    [err, pageText] = await to(page.evaluate(() => document.body.innerText));


    const s3 = new AWS.S3();

    // let resolveUpload, rejectUpload;
    // const waitForUploadResponse = () => {
    //   return new Promise((resolve, reject) => {
    //     resolveUpload = resolve;
    //     rejectUpload = reject;
    //   });
    // };

    const Key = `${site.name}/${site.name}_${batchTime}.jpeg`;
    const readable = intoStream(screenshot);
    const objectParams = {
      Bucket: "birdseyenews",
      Key,
      Body: readable
    };

    s3.upload(objectParams, {}, function (err, data) {
      if (err) {
        console.log(`!!Error uploading ${site.name} to aws!!`);
        console.log(err);
        // rejectUpload(err);
        return;
      }

      console.log(`+ ${site.name} uploaded to bucket`);
      // resolveUpload(data);
    });

    // upload file
    // let awsResponse;
    // [err, awsResponse] = await to(waitForUploadResponse());

    //======================
    // let resolveCurrentUpload, rejectCurrentUpload;
    // const waitForCurrentUploadResponse = () => {
    //   return new Promise((resolve, reject) => {
    //     resolveCurrentUpload = resolve;
    //     rejectCurrentUpload = reject;
    //   });
    // };

    const CurrentKey = `current/${site.name}.jpeg`;
    const currentReadable = intoStream(screenshot);
    const currentObjectParams = {
      Bucket: "birdseyenews",
      Key: CurrentKey,
      Body: currentReadable
    };

    s3.upload(currentObjectParams, {}, function (err, data) {
      if (err) {
        console.log(`!!Error uploading current ${site.name} to aws!!`);
        console.log(err);
        // rejectCurrentUpload(err);
        return;
      }

      console.log(`+ current ${site.name} uploaded to bucket`);
      // resolveCurrentUpload(data);
    });

    // upload file
    // let currentAwsResponse;
    // [err, currentAwsResponse] = await to(waitForCurrentUploadResponse());

    // [err, record] = await to(
    //   Record.create({
    //     batch: batchTime,
    //     site: site,
    //     image: awsResponse.Key,
    //     text: pageText,
    //     text_lower: pageText.toLowerCase()
    //   })
    // );

    if (err) console.error("Error", err);

    if (record) {
      console.log(`+ ${record.site.title} saved to mongodb`);
      mongodbCallback(record.id);
      return record;
    }
  } catch(e){
    console.log("Error creating record", e)
  }
};
