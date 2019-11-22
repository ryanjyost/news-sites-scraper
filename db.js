const mongoose = require("mongoose");
const URL = process.env.DB_URL;

// const URL =
//   "mongodb://skoosh:skoosh2002@ds127362.mlab.com:27362/newsbie-sandbox";

mongoose.connect(URL);
mongoose.Promise = global.Promise;
