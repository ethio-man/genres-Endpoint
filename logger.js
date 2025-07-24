const winston = require("winston");
//require("winston-mongodb");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    // new winston.transports.MongoDB({
    //   db: "mongodb://localhost:27017/genres",
    //   collection: "errorlog",
    //   level: "error",
    // }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exception.log" }),
    new winston.transports.Console(),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      colorized: true,
      prettyPrint: true,
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;

//error
//warns
//info
//verbose
//debug
//silly
