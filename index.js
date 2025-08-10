import logger from "./logger.js";
import express from "express";

const app = express();

import setUpRoutes from "./startup/routes.js";
import setUpDb from "./startup/db.js";
import setUpConfig from "./startup/config.js";
import setUpValidation from "./startup/validation.js";

setUpRoutes(app);
setUpDb();
setUpConfig();
setUpValidation();

process.on("unhandledRejection", (ex) => {
  throw ex;
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  logger.info(`listening to the port ${port}...`)
);
export default server;
