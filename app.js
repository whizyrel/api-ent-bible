// @ts-ignore
const express = require('express');
// @ts-ignore
const bodyParser = require('body-parser');
// @ts-ignore
const morgan = require('morgan');
const app = express();

const Feedback = require('./routes/feedback');
const v1Api = require('./routes/v1/api');
const AdminAPI = require('./routes/admin/api');
const Users = require('./routes/user');
const Commentary = require('./routes/commentary');
const AdminCommentary = require('./routes/admin/commentary');
const Donations = require('./routes/donation');


// [middleware] using morgan
app.use(morgan('dev'));

// [middleware] using body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// [middleware] address cors related issues
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, application/x-www-form-urlencoded, ' +
      'Accept, Authorization, Content-Type'
  );

  if (req.method == 'OPTIONS') {
    return res.status(200).json({});
  }
  next();
});

// serving static files at root
// @ts-ignore
app.use('/', express.static('public'));

// @ts-ignore
app.use('/', express.static('uploads'));

// [feedback] routes to feedback
// @ts-ignore
app.use('/feedback', Feedback);

// [donation] routes to doantion
// @ts-ignore
app.use('/donation', Donations);

// [User] user and admin routes
// @ts-ignore
app.use('/users', Users);
app.use('/u', Users);

// [api] user routes
// @ts-ignore
app.use('/v1/api', v1Api);

// [api] admin routes
// @ts-ignore
app.use('/admin/api', AdminAPI);

// [commentary] user routes
// @ts-ignore
app.use('/api/commentary', Commentary);

// [api] admin commentary routes
// @ts-ignore
app.use('/admin/api/commentary', AdminCommentary);

// [middleware] handling errors from route
// @ts-ignore
app.use((req, res, next) => {
  const error = new Error('Oops! something went wrong');
  // @ts-ignore
  error.status = 404;
  next(error);
});

// route "/"
app.get('/', (req, res, next) => {
  return res.send(
      `Welcome to my door step, i previously put an error message for you.
      I guess this is friendlier. I am glad you visited me,
      visit my documentation for more on how ican help with your requests.`
  );
});

// [middleware] global catch error, final stop
// @ts-ignore
app.use((error, req, res, next) => {
  // [error 404] implement one nice error 404 page
  res.status(error.status || 400).json({
    error: error.message,
  });
  next();
});

module.exports = app;
