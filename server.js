const express = require('express');
const mongoose = require('mongoose');

const config = require('./app');

const app = express();

mongoose
    .connect(
        process.env.M_PURI,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          autoIndex: true,
        }
    )
    .then((resp) => console.log(`[Mongodb Server] started on port 27017`))
    .catch((err) => console.log(err));
// @ts-ignore
mongoose.Promise = global.Promise;

// [middleware] all configurations
app.use(config);

// [port] specifying ports: environment || specific port
// @ts-ignore
const port = process.env.PORT || 4445;

// [port] listening to port with cb
app.listen(port, () => {
  console.log(`[Server] started on port ${port}`);
});
