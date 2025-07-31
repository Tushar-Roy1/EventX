const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  optional: String,
  organizedBy: String,
  category: String,
  eventDate: Date,
  eventTime: String,
  location: String,
  ticketPrice: Number,
  image: String,
  likes: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel;
