const mongoose = require("mongoose");
const movies = require("./routes/movies");
const customers = require("./routes/customer");
const genres = require("./routes/genres");
const rentals = require("./routes/rental");
const users = require("./routes/user");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/genres")
  .then(() => console.log("Successfuly connected to database ."))
  .catch((err) => console.log(err.message));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to the port ${port}...`));
