const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  eventTitle: {
    type: String,
    required: true,
    trim: true,
  },
  eventDateTime: {
    type: Date,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  paymentId: {
    type: String,
    required: true,
    trim: true,
  },
  orderId: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  currency: {
    type: String,
    default: "INR",
    enum: ["INR", "USD", "EUR"], // Add more as needed
  },
  receipt: {
    type: String,
    required: true,
    trim: true,
  },
  bookingCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
}, { timestamps: true });

// Ensure unique index for bookingCode
bookingSchema.index({ bookingCode: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
