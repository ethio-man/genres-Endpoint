import express from "express";
import movies from "../routes/movies.js";
import customers from "../routes/customer.js";
import genres from "../routes/genres.js";
import rentals from "../routes/rental.js";
import users from "../routes/user.js";
import auth from "../routes/auth.js";
import returns from "../routes/returns.js";
import error from "../middleware/error.js";

export default function (app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/movies", movies);
  app.use("/api/customers", customers);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(error);
}
