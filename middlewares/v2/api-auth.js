module.exports = (req, res, next) => {
  const {query: {key}} = req;

  // use encoded string instead of bare _id as api key
  if (key) {
    // authenticate user against api-collection
    // further authenticate user against grand db
  } else {
    return res.status(401).json({
      message: 'Authorization failed',
    });
  }
};

/*
  generate api key
    - authenticate against gci db using email
    - save to api collection
  revoke key
    - change access to false
  delete key
    -remove key from db
  add permissions
    - add permissions for the api key
  remove permissions
    - remove permissions for the api key
*/
