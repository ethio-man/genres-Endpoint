const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");
const logger = require("../logger");
module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db)
    .then(() => logger.info(`Successfuly connected to ${db}.`));
};
