const Pricing = require("../models/Pricing");

// GET ALL PRICES (Public)
const getPricing = async (req, res) => {
  const prices = await Pricing.find();
  res.json(prices);
};

// ADD PRICE (Admin)
const addPricing = async (req, res) => {
  const { garmentType, price } = req.body;

  const item = await Pricing.create({ garmentType, price });

  res.json(item);
};

module.exports = { getPricing, addPricing };