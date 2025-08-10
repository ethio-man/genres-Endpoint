import logger from "../logger.js";

export default function (err, req, res, next) {
  logger.error(err.message, { stack: err.stack });

  res.status(500).send("Something faild...");
}

/*
this middleware is required because all exceptions better to be handled in one place
this helps to make simple changes in error handlers in one place in the future
*/
