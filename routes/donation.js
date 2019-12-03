// eslint-disable-next-line new-cap
const route = require('express').Router();

const checkAuth = require('../middlewares/check-auth');

const {
  give, list,
} = require('../controllers/donation');

route.post('/give', give);

route.get('/list', checkAuth, list);

module.exports = route;
