const express = require("express");
const {
  createRide,
  getAllPublishedRides,
  searchRides,
  getRideById,
  getMyRides,
  updateRide,
  deleteRide,
} = require("../controllers/rideController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllPublishedRides);
router.get("/search", searchRides);
router.get("/user/my-rides", protect, getMyRides);
router.get("/:id", getRideById);

router.post("/", protect, createRide);
router.put("/:id", protect, updateRide);
router.delete("/:id", protect, deleteRide);

module.exports = router;