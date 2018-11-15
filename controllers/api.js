const express = require('express');
const mogoose = require('mongoose');

exports.getAll = (req, res, next) => {
    res.status(200).json({
        message: 'you have reached /api/all books'
    });
};

exports.getDr = (req, res, next) => {
    res.status(200).json({
        message: 'you have reached /api daily reading provision'
    });
};

exports.getBook = (req, res, next) => {
    res.status(200).json({
        message: 'you have reached /api books of this version'
    });
};

exports.getChapter = (req, res, next) => {
    res.status(200).json({
        message: 'you have reached /api chapters of a book in this version'
    });
};

exports.getVerse = (req, res, next) => {
    res.status(200).json({
        message: 'you have reached /api verses of a chapter in book of this version'
    });
};