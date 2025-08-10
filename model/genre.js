import Joi from "joi";
import mongoose from "mongoose";

export const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 52,
  },
});

export const Genres = mongoose.model("genres", genreSchema);

export function validator(req) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(52).required(),
  });
  return schema.validate(req.body);
}
