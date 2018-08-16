const mongoose = require("mongoose");

const batchOfTagsSchema = new mongoose.Schema({
  created_at: { type: Date, default: new Date() },
  tags: Array,
  politicsTags: Array,
  opinionTags: Array,
  sourceCount: Number
});

module.exports = mongoose.model("batchOfTags", batchOfTagsSchema);
