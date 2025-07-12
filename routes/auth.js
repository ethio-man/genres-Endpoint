const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../model/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

const validate = function (req) {
  const schema = Joi.object({
    email: Joi.string().min(10).max(55).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(req.body);
};

module.exports = router;
