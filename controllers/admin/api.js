const express = require('express');
const mongoose = require('mongoose');
const Chapter = require('../../models/chapter');

const app = express();

exports.addResource = (req, res, next) => {
    Chapter.create(req.body)
        .then(doc => {
            res.status(201).json({
                message: 'you\'ve reached /admin/api/create route',
                resource: {
                    version: doc.version,
                    verses: doc.verses,
                    chapterNo: doc.chapterNo,
                    bookTitle: doc.bookTitle
                }
            });
        })
        .catch(err => res.status(422).json({ error: err.message}));
};

exports.editResource = (req, res, next) => {
    res.status(201).json({
        message: 'you\'ve reached /admin/api/modify route',
        version: req.body
    });
};