const express = require("express");
const router = express.Router();
const { movies, validator } = require("../model/movies");
const { Genres } = require("../model/genre");
//read all
router.get("/", async (req, res) => {
  const movie = await movies.find().select({
    name: 1,
    genre: 1,
  });
  res.send(movie);
});
//read with id
router.get("/:id", async (req, res) => {
  const movie = await movies.findById(req.params.id);
  if (!movie) return res.status(404).send("⚠️ The film is not found!");
  res.send(movie);
});
//create
router.post("/", async (req, res) => {
  const { error, value } = validator(req);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genres.findById(req.body.genreId);
  if (!genre) res.status(404).send("The genre is not found.");

  let movie = new movies({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movie = await movie.save();
  res.send(movie);
});
//update
router.put("/:id", async (req, res) => {
  const { error } = validator(req);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = Genres.findById(req.body.genreId);
  if (!genre) res.status(404).send("The genre is not found.");

  const movie = await movies.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie) return res.status(404).send("The film is not found");

  res.send(movie);
});
//delete
router.delete("/:id", async (req, res) => {
  const movie = await movies.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("The film is not found");
  res.send(movie);
});

module.exports = router;
