const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 0,
    max: 53,
    tram: true,
    required: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: Number,
  dailyRentalRate: Number,
});

const Movies = mongoose.model("Movie", movieSchema);

const validator = function (req) {
  const schema = Joi.object({
    title: Joi.string().required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
  });
  return schema.validate(req.body);
};

exports.movies = Movies;
exports.validator = validator;
