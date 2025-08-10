import Joi from "joi";
import bcrypt from "bcrypt";
import express from "express";
import { User } from "../model/user.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/", validate(validator), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

function validator(req) {
  const schema = Joi.object({
    email: Joi.string().min(10).max(55).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(req.body);
}

export default router;
