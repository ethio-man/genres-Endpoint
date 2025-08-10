import mongoose from "mongoose";
import express from "express";
import { Rental, validator } from "../model/rental.js";
import validate from "../middleware/validate.js";
import { Customers } from "../model/customer.js";
import { Movies } from "../model/movies.js";

const router = express.Router();

//read all
router.get("/", async (req, res) => {
  const rent = await Rental.find().sort("dateOut");
  res.status(200).send(rent);
});
//read with id
router.get("/:id", async (req, res) => {
  const rent = await Rental.findById(req.params.id);
  if (!rent) return res.status(404).send("⚠️ The rental is not found!");
  res.send(rent);
});
//create
router.post("/", validate(validator), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customer = await Customers.findById(req.body.customerId).session(
      session
    );
    if (!customer)
      return res
        .status(400)
        .send("Customer is not found! please register first.");

    const movie = await Movies.findById(req.body.movieId).session(session);
    if (!movie) return res.status(400).send("The movie is not found.");

    if (movie.numberInStock === 0)
      return res.status(400).send(" Movie not in stack.");

    let rent = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold,
      },
      movies: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });
    rent = await rent.save({ session });

    movie.numberInStock--;
    await movie.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.send(rent);
  } catch (ex) {
    await session.abortTransaction();
    session.endSession();
    console.log("Transaction faild ", ex.message);
    res.status(500).send("something went wrong in transaction");
  }
});
//update
router.put("/:id", validate(validator), async (req, res) => {
  const customer = await Customers.findById(req.body.customerId);
  if (!customer)
    return res
      .status(400)
      .send("Customer is not found! please register first.");
  const movie = await Movies.findById(req.body.movieId);
  if (!movie) return res.status(400).send("The movie is not found.");
  if (movie.numberInStock === 0)
    return res.status(400).send(" Movie not in stack.");

  let rent = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movies: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    },
    { new: true }
  );

  if (!rent) return res.status(404).send("The film is not found");

  res.send(rent);
});
//delete
router.delete("/:id", async (req, res) => {
  const rent = await Rental.findByIdAndDelete(req.params.id);
  if (!rent) return res.status(404).send("The film is not found");
  res.send(rent);
});

export default router;
