const User = require('../models/user');

module.exports = (req, res, next) => {
  if (req.query.key) {
    User.findOne({ _id: req.query.key })
      .then(doc => {
        if (req.query.key == doc._id) {
          next();
        } else {
          return res.status(401).json({
            message: 'Authorization failed'
          });
        }
      })
      .catch(err => {
        res.status(404).json({
          error: err
        })
      });
  } else {
    return res.status(401).json({
      message: 'Authorization failed'
    }); 
  }
}