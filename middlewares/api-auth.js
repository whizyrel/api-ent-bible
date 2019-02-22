const User = require('../models/user');

module.exports = (req, res, next) => {
  // use encoded string instead of bare _id as api key
  if (req.query.key) {
    // use buffer instead of cryptoJs -> i would rather cryptoJs
    const decodedKey = Buffer.from(req.query.key, 'base64').toString('ascii');
    console.log(decodedKey);
    User.findOne({_id: decodedKey})
        .then((doc) => {
          if (doc) {
            next();
          } else {
            return res.status(401).json({
              message: 'Authorization failed',
            });
          }
        })
        .catch((err) => {
          res.status(404).json({
            error: 'Invalid request',
          });
        });
  } else {
    return res.status(401).json({
      message: 'Authorization failed',
    });
  }
};
