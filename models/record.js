const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  batch: Number,
  site: {
    name: String,
    url: String,
    title: String
  },
  text: String,
  text_lower: String,
  content: {
    links: Array
  },
  image: String,
  created_at: { type: Date, default: new Date() },
  uploaded_at: String
});

module.exports = mongoose.model("record", recordSchema);
