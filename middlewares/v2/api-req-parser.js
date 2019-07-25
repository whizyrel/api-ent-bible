exports.checkQuery = (req, res, next) => {
  const {query: {vrsn}, params: {wh}, originalUrl, path} = req;

  console.log({wh, originalUrl, path});

  if (
    req.path == '/all/' ?
    req.query && vrsn :
    req.query && vrsn && wh
  ) {
    next();
  } else {
    return res.status(404).json(
        {
          message: 'Invalid Request. Please check your queries',
        }
    );
  }
};
