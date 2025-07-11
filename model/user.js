const Joi = require("joi");
const mongoose = require("mongoose");

const User = mongoose.model(
  "user",
  new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      maxlength: 55,
      required: true,
    },
    email: {
      type: String,
      minlength: 10,
      maxlength: 55,
      unique: true,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 1024,
      required: true,
    },
  })
);

const validate = function (req) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(55).required(),
    email: Joi.string().min(10).max(55).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(req.body);
};

exports.User = User;
exports.validate = validate;
