import express from "express";
import validateObjectId from "../middleware/validateObjectId.js";
import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import { Genres, validator } from "../model/genre.js";

const router = express.Router();

//read all

router.get("/", async (req, res) => {
  const genres = await Genres.find().sort("name");
  res.send(genres);
});
//read with id
router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genres.findById(req.params.id);
  if (!genre) return res.status(404).send("⚠️ The film is not found!");
  res.send(genre);
});
//create
router.post("/", [auth, validate(validator)], async (req, res) => {
  let genre = new Genres({
    name: req.body.name,
  });
  genre = await genre.save();

  res.send(genre);
});
//update
router.put("/:id", [auth, validate(validator)], async (req, res) => {
  let genre = await Genres.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!genre) return res.status(404).send("The film is not found");

  res.send(genre);
});
//delete
router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genres.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send("The film is not found");
  res.send(genre);
});

export default router;
