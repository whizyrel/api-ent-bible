const express = require('express');
const adminAPIController = require('../../controllers/admin/api');

const route = express.Router();

// create and edit
// create resource
route.post('/create', adminAPIController.addResource);

// edit resource component
route.patch('/modify', adminAPIController.editResource);

module.exports = route;