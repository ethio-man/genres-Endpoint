import Joi from "joi";
import mongoose from "mongoose";
import moment from "moment";

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
  },
  movies: {
    type: new mongoose.Schema({
      title: {
        type: String,
        minlength: 3,
        maxlength: 25,
        trim: true,
        required: true,
      },
      dailyRentalRate: {
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
});
rentalSchema.statics.lookUp = function (customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movies._id": movieId,
  });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.movies.dailyRentalRate;
};

export const Rental = mongoose.model("rental", rentalSchema);

export function validator(req) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });
  return schema.validate(req.body);
}
