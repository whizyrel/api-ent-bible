const express = require('express');
const adminCtrl = require('../../controllers/admin/api');

const route = express.Router();

// create and edit
// create resource
route.post('/create', adminCtrl.addResource);

// edit resource component
route.patch("/modify", adminCtrl.editResource);

module.exports = route;