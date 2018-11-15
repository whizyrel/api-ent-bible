const express = require('express');
const adminCommentaryController = require('../../controllers/admin/commentary');

const route = express.Router();

// create and edit
route.post('/create', adminCommentaryController.addResource);

route.patch('/modify', adminCommentaryController.editResource);

module.exports = route;