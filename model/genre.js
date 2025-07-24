const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 52,
  },
});

const Genres = mongoose.model("genres", genreSchema);

const validator = function (req) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(52).required(),
  });
  return schema.validate(req.body);
};
exports.genreSchema = genreSchema;
exports.Genres = Genres;
exports.validator = validator;
