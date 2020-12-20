const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const replySchema = new mongoose.Schema({
  email: {
    type: String,
  },
  reply: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

const commentSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  comment: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  replies: [replySchema],
});

const ModelSchema = new Schema({
  blogTitle: {
    type: String,
    index: true,
  },
  blogBody: {
    type: String,
  },
  comments: [commentSchema],
  created_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports.Model = mongoose.model("blog", ModelSchema);
