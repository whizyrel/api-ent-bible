// @ts-ignore
const express = require("express");
// @ts-ignore
const bodyParser = require("body-parser");
// @ts-ignore
const morgan = require("morgan");

const feedback = require("./routes/feedback");
const api = require("./routes/api");
const adminAPI = require("./routes/admin/api");
const users = require("./routes/user");
const commentary = require("./routes/commentary");
const adminCommentary = require("./routes/admin/commentary");
const donations = require("./routes/donation");
// const ments = require("./routes/donation");

const app = express();

// [middleware] using morgan
app.use(morgan("dev"));

// [middleware] using body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [middleware] address cors related issues
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, application/x-www-form-urlencoded, Accept, Authorization, Content-Type"
  );

  if (req.method == "OPTIONS") {
    return res.status(200).json({});
  }
  next();
});

// serving static files at root
// @ts-ignore
app.use("/", express.static("public"));

// @ts-ignore
app.use("/", express.static("uploads"));

// [feedback] routes to feedback
// @ts-ignore
app.use("/feedback", feedback);

// [donation] routes to doantion
// @ts-ignore
app.use("/donation", donations);

// [User] user and admin routes
// @ts-ignore
app.use("/users", users);

// [api] user routes
// @ts-ignore
app.use("/api", api);

// [api] admin routes
// @ts-ignore
app.use("/admin/api", adminAPI);

// [commentary] user routes
// @ts-ignore
app.use("/api/commentary", commentary);

// [api] admin commentary routes
// @ts-ignore
app.use("/admin/api/commentary", adminCommentary);

// [middleware] handling errors from route
// @ts-ignore
app.use((req, res, next) => {
  const error = new Error("Oops! something went wrong");
  // @ts-ignore
  error.status = 404;
  next(error);
});

// [middleware] global catch error, final stop
// @ts-ignore
app.use((error, req, res, next) => {
  // [error 404] implement one nice error 404 page
  res.status(error.status || 400).json({
    error: error.message
  });
  next();
});

module.exports = app;
