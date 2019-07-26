const User = require('../models/user');

module.exports = (req, res, next) => {
  const {query: {key}} = req;

  // use encoded string instead of bare _id as api key
  if (key) {
    // authenticate user against api-collection
  } else {
    return res.status(401).json({
      message: 'Authorization failed',
    });
  }
};

/*
  generate api key
    - authenticate against gci db using email
  revoke key
  delete key
  add permissions
  remove permissions
*/
