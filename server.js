const app = require('express')();
const mongoose = require('mongoose');

const config = require('./app');

const {M_PURI, M_DURI, PORT} = process.env;

mongoose
    .connect(
        M_PURI || M_DURI,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          autoIndex: true,
        }
    )
    .then(
        (resp) => console.log(
            `[Mongodb Server] started on port ${resp.connections[0].port}`
        )
    )
    .catch((err) => console.log(err));
// @ts-ignore
mongoose.Promise = global.Promise;

// [middleware] all configurations
app.use(config);

// [port] specifying ports: environment || specific port
// @ts-ignore

// [port] listening to port with cb
app.listen(PORT || 4445, () => {
  console.log(`[Server] started on port ${PORT}`);
});
