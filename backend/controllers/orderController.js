const Order = require("../models/Order");
const Pricing = require("../models/Pricing");

const generateOrderId = () => {
  return "ORD-" + Date.now();
};

// CREATE ORDER (Customer) - supports multiple items
const createOrder = async (req, res) => {
  try {
    const { items, deliveryType, scheduledDate } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0 || !scheduledDate) {
      return res.status(400).json({ message: "Items and scheduled date are required" });
    }

    const normalizedItems = [];
    let totalBill = 0;

    for (const item of items) {
      if (!item.garmentType || !item.quantity) {
        return res.status(400).json({ message: "Each item must have garment type and quantity" });
      }

      const pricing = await Pricing.findOne({ garmentType: item.garmentType });

      if (!pricing) {
        return res.status(400).json({
          message: `Invalid garment type: ${item.garmentType}`,
        });
      }

      const quantity = Number(item.quantity);

      if (quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than 0" });
      }

      const pricePerItem = pricing.price;
      const itemTotal = pricePerItem * quantity;

      normalizedItems.push({
        garmentType: item.garmentType,
        quantity,
        pricePerItem,
        itemTotal,
      });

      totalBill += itemTotal;
    }

    let extraCharge = 0;
    if (deliveryType === "PICKUP") {
      extraCharge = 50;
    }

    const existingOrders = await Order.find({ customer: req.user._id });
    const discount = existingOrders.length === 0 ? 20 : 0;

    const finalAmount = totalBill + extraCharge - discount;

    const order = await Order.create({
      orderId: generateOrderId(),
      customer: req.user._id,
      items: normalizedItems,
      totalBill,
      deliveryType,
      extraCharge,
      discount,
      finalAmount,
      scheduledDate,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating order" });
  }
};

// GET ORDERS
const getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === "admin") {
      orders = await Order.find()
        .populate("customer", "name email")
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    }

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// UPDATE STATUS (Admin only)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
};

// DASHBOARD
const getDashboard = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, o) => acc + o.finalAmount, 0);

    res.json({ totalOrders, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateStatus,
  getDashboard,
};