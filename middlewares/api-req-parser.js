exports.checkAll = (req, res, next) => {
  if (req.query && req.query.vrsn) {
    next();
  } else {
    res.status(404).json({ message: 'Invalid Request. Please check your queries' });
  }
};

exports.checkBookQuery = (req, res, next) => {
  if (req.query && req.query.vrsn && req.query.bk) {
    next();
  } else {
    res
      .status(404)
      .json({ message: "Invalid Request. Please check your queries" });
  }
};

exports.checkChapQuery = (req, res, next) => {
  if (req.query && req.query.vrsn && req.query.bk && req.query.chp) {
    next();
  } else {
    res
      .status(404)
      .json({ message: "Invalid Request. Please check your queries" });
  }
};

exports.checkVrsQuery = (req, res, next) => {
  if (req.query && req.query.vrsn && req.query.bk && req.query.chp && req.query.vrs) {
    next();
  } else {
    res
      .status(404)
      .json({ message: "Invalid Request. Please check your queries" });
  }
};
