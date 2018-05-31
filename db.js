const mongoose = require("mongoose");
const URL =
  "mongodb://skoosh:skoosh2016@ds157499.mlab.com:57499/media-bias-map";

mongoose.connect(URL);
mongoose.Promise = global.Promise;
