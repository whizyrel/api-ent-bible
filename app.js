const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const multer = require('multer');

const apiRoutes = require('./routes/api');
const adminAPIRoutes = require('./routes/admin/api');
const userRoutes = require('./routes/user');
const commentaryRoutes = require('./routes/commentary');
const adminCommentaryRoutes = require('./routes/admin/commentary');

const app = express();

// [middleware] using morgan
app.use(morgan('dev'));

// [middleware] using body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// [middleware] address cors related issues
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Method', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Header', 'Origin, application/x-www-form-urlencoded, Accept, Authorization, content-Type');

    if (req.method == 'OPTIONS') {
        return res.status(200).json({});
    }
    next();
});

// serving static files at root
app.use('/', express.static('public'));

// [User] user and admin routes
app.use('/users', userRoutes);

// [api] user routes
app.use('/api', apiRoutes);

// [commentary] user routes
app.use('/api/commentary', commentaryRoutes);

// [api] admin routes
app.use('/admin/api', adminAPIRoutes);

// [api] admin commentary routes
app.use('/admin/api/commentary', adminCommentaryRoutes);

// [middleware] handling errors from route
app.use((req, res, next) => {
    const error = new Error('Oops! something went wrong');
    // @ts-ignore
    error.status = 404;
    next(error);
});

// [middleware] global catch error, final stop
app.use((error, req, res, next) => {
    // [error 404] implement one nice error 404 page 
    res.status(error.status || 500).json({
        error: error.message
    });
    next();
});

module.exports = app;