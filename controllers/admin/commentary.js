const express = require('express');
const mogoose = require('mongoose');

const app = express();

exports.addResource = (req, res, next) => {
    res.status(201).json({
        message: 'you\'ve reached /admin/api/commentary/create route'
    });
};

exports.editResource = (req, res, next) => {
    res.status(201).json({
        message: 'you\'ve reached /admin/api/commentary/modify route'
    });
};