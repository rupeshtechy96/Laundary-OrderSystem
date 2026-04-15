const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    garmentType: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerItem: {
      type: Number,
      required: true,
      min: 1,
    },
    itemTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one order item is required",
      },
    },

    totalBill: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryType: {
      type: String,
      enum: ["SELF", "PICKUP"],
      default: "SELF",
    },

    extraCharge: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    scheduledDate: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "PROCESSING", "READY", "DELIVERED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);