import Joi from "joi";
import express from "express";
import { Rental } from "../model/rental.js";
import { Movies } from "../model/movies.js";
import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookUp(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("rental not found");
  if (rental.dateReturned)
    return res.status(400).send("rental already processed");

  await rental.return();
  await rental.save();

  await Movies.updateOne(
    { _id: rental.movies._id },
    { $inc: { numberInStock: 1 } }
  );
  return res.send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req.body);
}
export default router;
