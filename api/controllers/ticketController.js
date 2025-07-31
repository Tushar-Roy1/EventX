const Ticket = require('../models/Ticket.js');

const createTicket = async (req, res) => {
  try {
    const newTicket = new Ticket(req.body);
    await newTicket.save();
    res.status(201).json({ ticket: newTicket });
  } catch (error) {
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userid: req.params.userId });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user tickets" });
  }
};

const deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete ticket" });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getUserTickets,
  deleteTicket,
};
