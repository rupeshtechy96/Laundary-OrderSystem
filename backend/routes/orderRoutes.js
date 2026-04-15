const express = require("express");
const {
  createOrder,
  getOrders,
  updateStatus,
  getDashboard,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.patch("/:id", protect, adminOnly, updateStatus);
router.get("/dashboard", protect, adminOnly, getDashboard);

module.exports = router;