// const User = require('../models/user');
const Key = require('../models/keys');

module.exports = (req, res, next) => {
  const {query: {key}} = req;

  // use encoded string instead of bare _id as api key
  if (key) {
    // save keys into table
    // use buffer instead of cryptoJs -> i would rather cryptoJs
    // const decodedKey = Buffer.from(key, 'base64').toString('ascii');
    // console.log(decodedKey);

    Key.findOne({key})
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
          return res.status(404).json({
            error: 'Invalid request',
          });
        });
  } else {
    return res.status(401).json({
      message: 'Authorization failed',
    });
  }
};
