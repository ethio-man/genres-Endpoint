import express from "express";
import { Customers, validator } from "../model/customer.js"; //   ../ means out side this folder(move up once)
import validate from "../middleware/validate.js";

const router = express.Router();

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
router.post("/", validate(validator), async (req, res) => {
  let customer = new Customers({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customer = await customer.save();
  res.send(customer);
});
//update
router.put("/:id", validate(validator), async (req, res) => {
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

export default router;
