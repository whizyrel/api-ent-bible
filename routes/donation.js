const express = require('express');
const checkAuth = require("../middlewares/check-auth");

const route = express.Router();

const DonationCtrl = require('../controllers/donation');

route.post('/give', DonationCtrl.give);

route.get('/list', checkAuth, DonationCtrl.list);

module.exports = route;