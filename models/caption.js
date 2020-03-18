var mongoose = require("mongoose");

var captionSchema = new mongoose.Schema({
  text: String,
  author: String,
  category: String,
  usedBy: {
    type: Number,
    default: 0
  },
  language: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Caption", captionSchema);
