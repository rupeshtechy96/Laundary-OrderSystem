const express = require("express");
const {
  getSchedule,
  updateSchedule,
} = require("../controllers/scheduleController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getSchedule);
router.post("/", protect, adminOnly, updateSchedule);

module.exports = router;