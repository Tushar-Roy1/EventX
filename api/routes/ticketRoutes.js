const express = require("express");
const router = express.Router();
const {
   createTicket,
   getAllTickets,
   getUserTickets,
   deleteTicket,
} = require("../controllers/ticketController");

router.post("/tickets", createTicket);
router.get("/tickets/:id", getAllTickets);
router.get("/tickets/user/:userId",getUserTickets);
router.delete("/tickets/:id", deleteTicket);

module.exports = router;
