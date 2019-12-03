const express = require('express');
const adminCommentaryController = require('../../controllers/admin/commentary');

// eslint-disable-next-line new-cap
const route = express.Router();

// create and edit
route.post('/create', adminCommentaryController.addResource);

route.patch('/modify', adminCommentaryController.editResource);

module.exports = route;
