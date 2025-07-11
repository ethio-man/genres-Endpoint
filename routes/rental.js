const { Rental, validate } = require("../model/rental");
const { Customers } = require("../model/customer");
const { movies } = require("../model/movies");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
//read all
router.get("/", async (req, res) => {
  const rent = await Rental.find().sort("-dateOut").select({
    name: 1,
    category: 1,
  });
  res.send(rent);
});
//read with id
router.get("/:id", async (req, res) => {
  const rent = await Rental.findById(req.params.id);
  if (!rent) return res.status(404).send("⚠️ The rental is not found!");
  res.send(rent);
});
//create
router.post("/", async (req, res) => {
  const { error, value } = validate(req);
  if (error) return res.status(400).send(error.details[0].message);

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

    const movie = await movies.findById(req.body.movieId).session(session);
    if (!movie) return res.status(400).send("The movie is not found.");

    if (movie.numberInStack === 0)
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

    movie.numberInStack--;
    const result = await movie.save({ session });

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
router.put("/:id", async (req, res) => {
  const { error } = validate(req);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = Customers.findById(req.body.customerId);
  if (!customer)
    return res
      .status(400)
      .send("Customer is not found! please register first.");
  const movie = movies.findById(req.body.movieId);
  if (!movie) return res.status(400).send("The movie is not found.");
  if (movie.numberInStack === 0)
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

module.exports = router;
