const express = require("express");
const router = express.Router();
const { Customers, validator } = require("../model/customer"); //   ../ means out side this folder(move up once)
//read all
router.get("/", async (req, res) => {
  const customer = await Customers.find().select({
    name: 1,
    phone: 1,
  });
  res.send(customer);
});
//read with id
router.get("/:id", async (req, res) => {
  const customer = await Customers.findById(req.params.id);
  if (!customer) return res.status(404).send("⚠️ The customer is not found!");
  res.send(customer);
});
//create
router.post("/", async (req, res) => {
  const { error, value } = validator(req);
  if (error) return res.status(400).send(error.details[0].message);
  let customer = new Customers({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customer = await customer.save();
  res.send(customer);
});
//update
router.put("/:id", async (req, res) => {
  const { error } = validator(req);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = await Customers.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!customer) return res.status(404).send("The customer is not found");

  res.send(customer);
});
//delete
router.delete("/:id", async (req, res) => {
  const customer = await Customers.deleteOne({ _id: req.params.id });
  if (!customer) return res.status(404).send("The customer is not found");
  res.send(customer);
});

module.exports = router;
