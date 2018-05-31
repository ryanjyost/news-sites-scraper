const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  batch: Number,
  site: {
    name: String,
    url: String
  },
  content: {
    links: Array
  },
  image: {
    url: String,
    secure_url: String
  },
  created_at: { type: Date, default: new Date() },
  uploaded_at: String
});

module.exports = mongoose.model("record", recordSchema);
