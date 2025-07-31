const Event = require('../models/Event');

// Create Event
// Create Event Controller
const createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    eventData.image = req.file ? req.file.path : "";

    const newEvent = new Event(eventData);
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to save the event to MongoDB" });
  }
};


// Get All Events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('owner', 'name');
    res.status(200).json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch events', error: err.message });
  }
};


// Get Event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
  }
};

const likeEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id; // assumes you're using auth middleware

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Check if user already liked
    if (event.likes.includes(userId)) {
      return res.status(400).json({ success: false, message: "User already liked this event" });
    }

    // Add userId to likes array
    event.likes.push(userId);
    await event.save();

    res.status(200).json({
      success: true,
      message: "Event liked successfully",
      totalLikes: event.likes.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error liking event", error: err.message });
  }
};

module.exports = { likeEvent };
// Order Summary (dummy handler)
const orderSummary = async (req, res) => {
  try {
    // Placeholder logic
    res.status(200).json({ success: true, message: 'Order summary placeholder' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching order summary', error: err.message });
  }
};

// Payment Summary (dummy handler)
const paymentSummary = async (req, res) => {
  try {
    // Placeholder logic
    res.status(200).json({ success: true, message: 'Payment summary placeholder' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching payment summary', error: err.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  likeEvent,
  orderSummary,
  paymentSummary,
};
