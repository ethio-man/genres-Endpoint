import Joi from "joi";
import mongoose from "mongoose";
import { genreSchema } from "./genre.js";

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

export const Movies = mongoose.model("Movie", movieSchema);

export function validator(req) {
  const schema = Joi.object({
    title: Joi.string().required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
  });
  return schema.validate(req.body);
}
