const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");
const movies = require("./routes/movies");
const customers = require("./routes/customer");
const genres = require("./routes/genres");
const rentals = require("./routes/rental");
const users = require("./routes/user");
const auth = require("./routes/auth");
const error = require("./middleware/error");
const express = require("express");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR:jwtPrivateKey is not defined"); // if this happen in terminal-> export vidly_jwtPrivateKey=securityKey
  process.exit(1);
}
mongoose
  .connect("mongodb://localhost:27017/genres?replicaSet=rs0")
  .then(() => console.log("Successfuly connected to database ."))
  .catch((err) => console.log(err.message));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to the port ${port}...`));
