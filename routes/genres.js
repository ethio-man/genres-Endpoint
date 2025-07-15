const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genres, validator } = require("../model/genre");
//read all

router.get("/", async (req, res) => {
  throw new Error("COULDN'T GET GENRES ...");
  const genre = await Genres.find().select({
    name: 1,
    category: 1,
  });
  res.send(genre);
});
//read with id
router.get("/:id", async (req, res) => {
  const genre = await Genres.findById(req.params.id);
  if (!genre) return res.status(404).send("⚠️ The film is not found!");
  res.send(genre);
});
//create
router.post("/", auth, async (req, res) => {
  const { error, value } = validator(req);
  if (error) return res.status(400).send(error.details[0].message);
  let genre = new Genres({
    name: req.body.name,
  });
  genre = await genre.save();
  res.send(genre);
});
//update
router.put("/:id", auth, async (req, res) => {
  const { error } = validator(req);
  if (error) return res.status(400).send(error.details[0].message);

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

module.exports = router;
