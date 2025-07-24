const winston = require("winston");
const logger = require("./logger");

const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

process.on("unhandledRejection", (ex) => {
  throw ex;
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  logger.info(`listening to the port ${port}...`)
);
module.exports = server;
