const express = require("express");
const {
  getPricing,
  addPricing,
} = require("../controllers/pricingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPricing);
router.post("/", protect, adminOnly, addPricing);

module.exports = router;