const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  round: Number,
  tags: Array,
  created_at: { type: Date, default: new Date() },
  completed_at: { type: Date, default: new Date() }
});

module.exports = mongoose.model("round", roundSchema);
