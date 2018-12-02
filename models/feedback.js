const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Feedback = new Schema({
  date: { type: String },
  time: {type: String},
  name: String,
  email: {
    type: String,
    required: true,
    match: [
      /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/,
      "invalid email"
    ]
  },
  imagePaths: [String],
  title: String,
  body: String,
  status: { type: String, default: "fresh" }
});

module.exports = mongoose.model("Feedback", Feedback);