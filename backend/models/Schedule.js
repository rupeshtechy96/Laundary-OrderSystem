const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      unique: true, // Monday, Tuesday, etc.
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openTime: {
      type: String, // "09:00 AM"
      default: "09:00 AM",
    },
    closeTime: {
      type: String, // "08:00 PM"
      default: "08:00 PM",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Schedule", scheduleSchema);