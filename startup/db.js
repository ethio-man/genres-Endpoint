const mongoose = require("mongoose");
const winston = require("winston");
const logger = require("../logger");
module.exports = function () {
  mongoose
    .connect("mongodb://localhost:27017/genres?replicaSet=rs0")
    .then(() => logger.info("Successfuly connected to database ."));
};
