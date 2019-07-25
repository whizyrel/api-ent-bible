/* eslint-disable max-len */
exports.checkAll = (req, res, next) => {
  const {query: {vrsn}} = req;

  if (req.query && vrsn) {
    next();
  } else {
    res.status(404).json(
        {
          message: 'Invalid Request. Please check your queries',
        }
    );
  }
};

exports.checkBookQuery = (req, res, next) => {
  const {query: {vrsn, bk}} = req;

  if (req.query && vrsn && bk) {
    next();
  } else {
    res
        .status(404)
        .json({message: 'Invalid Request. Please check your queries'});
  }
};

exports.checkChapQuery = (req, res, next) => {
  const {query: {vrsn, bk, chp}} = req;

  if (req.query && vrsn && bk && chp) {
    next();
  } else {
    res
        .status(404)
        .json({message: 'Invalid Request. Please check your queries'});
  }
};

exports.checkVrsQuery = (req, res, next) => {
  const {query: {vrsn, bk, chp, vrs}} = req;
  if (
    req.query && vrsn
    && bk && chp && vrs
  ) {
    next();
  } else {
    res
        .status(404)
        .json({message: 'Invalid Request. Please check your queries'});
  }
};
