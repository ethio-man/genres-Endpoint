import Joi from "joi";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "config";

const userSchema = new mongoose.Schema({
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
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};
export const User = mongoose.model("user", userSchema);

export function validator(req) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(55).required(),
    email: Joi.string().min(10).max(55).required().email(),
    password: Joi.string()
      .min(8)
      .max(255)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
        )
      )
      .message(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      )
      .required(),
  });
  return schema.validate(req.body);
}
