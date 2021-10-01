"use strict";

// Requirements
// when using Vue Router "history" mode
const express = require("express"),
  serveStatic = require("serve-static"),
  history = require("connect-history-api-fallback");

// Constants
const PORT = process.env.PORT ? process.env.PORT : 8080;
const HOST = process.env.HOST ? process.env.HOST : "0.0.0.0";

// App
const app = express();

// Logging
const logger = function (req, res, next) {
  console.log(
    `\nOriginal URL: ${req.originalUrl}\nBase URL: ${req.baseUrl}\nPath: ${
      req.path
    }\nRoute: ${JSON.stringify(req.route)}\nBody: ${req.body}`
  );
  console.log(`Request Headers:\n${JSON.stringify(req.headers, null, 2)}`);
  next(); // Passing the request to the next handler in the stack.
};
app.use(logger);

// Main
app.use(history());
app.use(serveStatic(__dirname + "/../dist/spa"));
console.log(`Running on http://${HOST}:${PORT}`);
app.listen(PORT, HOST);
