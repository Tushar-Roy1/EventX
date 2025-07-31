const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const Event = require('../models/Event');
const verifyToken = require('../middleware/authMiddleware');
const {
   createEvent,
   getEvents,
   getEventById,
   likeEvent,
   orderSummary,
   paymentSummary,
} = require("../controllers/eventController");



router.post("/createEvent", upload.single("image"), createEvent);
router.get("/getEvent", getEvents);
router.get("/getEvent/:id", getEventById);
router.post("/event/:eventId", likeEvent);
router.get("/event/:id/ordersummary", orderSummary);
router.get("/event/:id/ordersummary/paymentsummary", paymentSummary);

router.get('/search', async (req, res) => {
  try {
    const { search, category, location, date, sort } = req.query;
    const filter = {};

    // ✅ Keyword search (by title or description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // ✅ Category filter
    if (category) {
      filter.category = category;
    }

    // ✅ Location filter
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // ✅ Date filter
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(targetDate.getDate() + 1);

      filter.eventDate = {
        $gte: targetDate,
        $lt: nextDay
      };
    }

    // ✅ Sorting
    let sortOption = { eventDate: 1 }; // default sort by date
    if (sort === 'title') {
      sortOption = { title: 1 };
    }

    const events = await Event.find(filter).sort(sortOption);

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch filtered events' });
  }
});
// routes/eventRoutes.js or similar




// Get events owned by the logged-in user
router.get('/myevents', verifyToken, async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your events', error: err });
  }
});

// PUT /api/events/update/:id
router.put("/update/:id", verifyToken, upload.single("image"), async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Only event owner can update
    if (event.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🛠️ Build update object
    const updates = {
      ...req.body,
    };

    if (req.file) {
      // Optionally delete old image here
      updates.image = req.file.filename;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if the logged-in user owns the event
    if (event.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed", error: err.message });
  }
});







module.exports = router;
