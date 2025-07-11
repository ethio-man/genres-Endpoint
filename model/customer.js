const Joi = require("joi");
const mongoose = require("mongoose");

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

const Customers = mongoose.model("Customer", customerSchema);

const validator = function (req) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(req.body);
};

exports.Customers = Customers;
exports.validator = validator;
