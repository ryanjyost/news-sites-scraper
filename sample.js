// Load the SDK and UUID
var AWS = require("aws-sdk");
var uuid = require("uuid");

// Create unique bucket name
// var bucketName = "node-sdk-sample-" + uuid.v4();
// Create name for uploaded object key
var keyName = "hello_world.txt";

const config = {
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_KEY,
  secretAccesKey: process.env.AWS_SECRET
};

// Create a promise on S3 service object
// var bucketPromise = new AWS.S3(config)
//   .createBucket({ Bucket: bucketName })
//   .promise();

// Handle promise fulfilled/rejected states

var objectParams = {
  Bucket: "birdseyenews",
  Key: keyName,
  Body: "Hello World!"
};
// Create object upload promise
var uploadPromise = new AWS.S3(config).putObject(objectParams).promise();

uploadPromise.then(function(data) {
  console.log("Successfully uploaded data to S3");
});
