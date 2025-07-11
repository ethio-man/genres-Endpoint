const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  customer: {
    required: true,
    type: new mongoose.Schema({
      name: {
        type: String,
        minlength: 3,
        maxlength: 53,
        required: true,
        trim: true,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        minlength: 10,
        maxlength: 15,
        required: true,
      },
    }),
    movies: {
      type: new mongoose.Schema({
        title: {
          type: String,
          minlength: 3,
          maxlength: 25,
          trim: true,
          required: true,
        },
        dailyRenatalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: Date,
    rentalFee: {
      type: Number,
      min: 0,
    },
  },
});

const Rental = mongoose.model("rental", rentalSchema);

const validate = function (req) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });
  return schema.validate(req.body);
};
exports.Rental = Rental;
exports.validate = validate;
