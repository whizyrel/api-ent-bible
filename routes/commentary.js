const express = require('express');
const commentaryController = require('../controllers/commentary');

const route = express.Router();

// leave for update
// [routes] specify commentary types through queries
route.get('/', commentaryController.getCommentary);

module.exports = route;