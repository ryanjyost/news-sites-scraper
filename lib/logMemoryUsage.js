const bytes = require("bytes");
const os = require("os");

module.exports = function logMemoryUsage() {
  const usage = process.memoryUsage();
  console.log(
    "MEMORY:",
    "RSS=",
    bytes(usage.rss),
    " / HeapTotal=",
    bytes(usage.heapTotal),
    " / HeapUsed=",
    bytes(usage.heapUsed)
  );
  console.log("OS", bytes(os.totalmem()));
  return usage;
};
