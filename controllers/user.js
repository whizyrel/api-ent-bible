const express = require('express');
const mogoose = require('mongoose');

exports.signUp = (req, res, next) => {
    res.status(200).json({
        message: 'you have reached /users/signup'
    });
};

exports.signIn = (req, res, next) => {
    res.status(200).json({
        message: 'you have reached /users/signin'
    });
};

exports.modify = (req, res, next) => {
    res.status(201).json({
        message: 'you have reached /users/modify'
    });
};

exports.listUsers = (req, res, next) => {
    res.status(200).json({
        message: 'you have reached /users/list'
    });
};

exports.deleteUsers = (req, res, next) => {
    res.status(410 || 404).json({
        message: 'you have reached /users/delete'
    });
};