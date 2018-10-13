const mongoose = require("mongoose");
const URL =
  "mongodb://skoosh:skoosh2016@ds157499.mlab.com:57499/media-bias-map";

// const URL =
//   "mongodb://skoosh:skoosh2002@ds127362.mlab.com:27362/newsbie-sandbox";

mongoose.connect(URL);
mongoose.Promise = global.Promise;
