const express = require("express");
const router = express.Router();
const razorpay = require("../utils/razorpayInstance");
const Booking = require("../models/Booking"); // update the path as needed
const verifyToken = require('../middleware/authMiddleware');

// Step 1: Create Razorpay order
router.post("/create-order", async (req, res) => {
  const { amount, currency = "INR", receipt = "receipt#1" } = req.body;

  try {
    const options = {
      amount: amount * 100, // Razorpay takes amount in paise
      currency,
      receipt,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Order creation failed", error: error.message });
  }
});

// ✅ Step 2: Save payment/booking details
router.post("/save-payment", async (req, res) => {
  const {
    user,
    event,
    eventTitle,
    ownerName,
    paymentId,
    orderId,
    amount,
    receipt,
    bookingCode,
  } = req.body;
  console.log("Saving payment, request body:", req.body);


  if (!user || !event) {
    return res.status(400).json({ message: "User and event ID are required." });
  }

  try {
   const newBooking = new Booking({
  user,
  event,
  eventTitle,
  eventDateTime: new Date(), // Use server time instead of taking from frontend
  ownerName,
  paymentId,
  orderId,
  amount,
  receipt,
  bookingCode,
});

    await newBooking.save();
    res.status(201).json({ message: "Payment details saved successfully", booking: newBooking });
  } catch (error) {
    console.error("Error saving payment details:", error); 
    res.status(500).json({ message: "Failed to save payment details", error: error.message });
  }
});

router.get("/mybookings", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event") // 👈 Make sure `event` is the correct ref in schema
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
});


module.exports = router;
