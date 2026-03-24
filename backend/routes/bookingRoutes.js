const express = require("express");
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookingsForMyPostedRides,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/received-bookings", protect, getBookingsForMyPostedRides);
router.put("/cancel/:id", protect, cancelBooking);

module.exports = router;