import express from "express";
import { Movies, validator } from "../model/movies.js";
import validate from "../middleware/validate.js";
import { Genres } from "../model/genre.js";

const router = express.Router();

//read all
router.get("/", async (req, res) => {
  const movie = await Movies.find().select({
    name: 1,
    genre: 1,
  });
  res.send(movie);
});
//read with id
router.get("/:id", async (req, res) => {
  const movie = await Movies.findById(req.params.id);
  if (!movie) return res.status(404).send("⚠️ The film is not found!");
  res.send(movie);
});
//create
router.post("/", validate(validator), async (req, res) => {
  const genre = await Genres.findById(req.body.genreId);
  if (!genre) res.status(404).send("The genre is not found.");

  let movie = new Movies({
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
router.put("/:id", validate(validator), async (req, res) => {
  const genre = Genres.findById(req.body.genreId);
  if (!genre) res.status(404).send("The genre is not found.");

  const movie = await Movies.findByIdAndUpdate(
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
  const movie = await Movies.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("The film is not found");
  res.send(movie);
});

export default router;
