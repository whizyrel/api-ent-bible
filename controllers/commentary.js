const express = require('express');
const mogoose = require('mongoose');

exports.getCommentary = (req, res, next) => {
    res.status(200).json({
        message: 'you\'ve reached the /api/commentary route'
    });
};
