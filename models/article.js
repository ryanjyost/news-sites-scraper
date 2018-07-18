const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const articleSchema = new mongoose.Schema({
  category: String,
  round: Number,
  nlp: {
    afinn: Number,
    senticon: Number,
    pattern: Number,
    sentiment: mongoose.Schema.Types.Mixed
  },
  site: {
    name: String,
    url: String,
    title: String
  },
  siteName: String,
  created_at: { type: Date, default: new Date() },
  // uploaded_at: String,
  title: String,
  summary: String,
  description: String,
  link: String,
  origLink: mongoose.Schema.Types.Mixed,
  permaLink: mongoose.Schema.Types.Mixed,
  date: String,
  pubate: String,
  author: mongoose.Schema.Types.Mixed,
  guid: { type: String, index: true, unique: true, required: true },
  categories: Array,
  source: mongoose.Schema.Types.Mixed,
  image: mongoose.Schema.Types.Mixed
});

articleSchema.plugin(uniqueValidator);

module.exports = mongoose.model("article", articleSchema);
