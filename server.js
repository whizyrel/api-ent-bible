const express = require('express');
const mongoose = require('mongoose');

const config = require('./app');

const app = express();

mongoose.connect('mongodb://localhost:27017/bibleJSAPI', { useNewUrlParser: true, useCreateIndex: true })
.then(resp => console.log(`[Mongodb Server] started on port 27017`))
.catch(err => console.log(err));
mongoose.Promise = global.Promise;

// [middleware] all configurations
app.use(config);

// [port] specifying ports: environment || specific port
const port = process.env.PORT || 4445;

// [port] listening to port with cb
app.listen(port, () => {
    console.log(`[Server] started on port ${port}`);
});