exports.checkQuery = (req, res, next) => {
  const {query: {vrsn}, params: {wh}} = req;

  console.log({wh});

  if (req.query && vrsn && wh) {
    next();
  } else {
    return res.status(404).json(
        {
          message: 'Invalid Request. Please check your queries',
        }
    );
  }
};
