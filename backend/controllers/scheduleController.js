const Schedule = require("../models/Schedule");

const getSchedule = async (req, res) => {
  const schedule = await Schedule.find();
  res.json(schedule);
};

const updateSchedule = async (req, res) => {
  const { day, isOpen, openTime, closeTime } = req.body;

  const updated = await Schedule.findOneAndUpdate(
    { day },
    { isOpen, openTime, closeTime },
    { upsert: true, new: true }
  );

  res.json(updated);
};

module.exports = { getSchedule, updateSchedule };