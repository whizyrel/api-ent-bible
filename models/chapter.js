const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chapter = new Schema(
  {
    version: {
    type: String,
    index: true,
    default: "kjv"
  },
  bookTitle: {
    type: String,
    index: true,
    lowercase: true,
    required: [true, "Book Title is required"]
  },
  chapterNo: {
    type: String,
    index: true,
    lowercase: true,
    required: [true, "Chapter Number is required"]
  },
  verses: [
    {
      type: String,
      index: true,
      text: true,
      sparse: true,
      unique: true,
      required: [true, "Verses are required"]
    }
  ]
});

const Chapter = mongoose.model("Chapter", chapter);

module.exports = Chapter;