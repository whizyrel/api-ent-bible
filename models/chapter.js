const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chapter = new Schema({
    version: { type: String, default: 'kjv' },
    bookTitle: { type: String, required: [true, "Book Title is required"] },
    chapterNo: { type: String, unique: true, required: [true, "Chapter Number is required"] },
    verses: [ { type: String, unique: true, required: [true, "Verses are required"] } ]
});

const Chapter = mongoose.model('Chapter', chapter);

module.exports = Chapter;