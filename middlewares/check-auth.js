const JWT = require('jsonwebtoken');
const User = require('../models/user');

const JWT_KEY = process.env.JWT_KEY;

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    // @ts-ignore
    const decoded = JWT.verify(token, JWT_KEY);
    req.userData = decoded;
    console.log(decoded);

    User.find({_id: req.userData.id})
        .then((doc) => {
          if (doc.length >= 1) {
            next();
          } else {
            return res.status(401).json({
              message: 'Unauthorized Access',
            });
          }
        })
        .catch((err) => {
          return res.status(404).json({
            error: err + ': Something went wrong',
          });
        });
  } catch (err) {
    return res.status(401).json({
      message: 'Authentication failed',
    });
  }
};
