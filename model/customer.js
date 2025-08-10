import Joi from "joi";
import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isGold: Boolean,
});

export const Customers = mongoose.model("Customer", customerSchema);

export function validator(req) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(req.body);
}
