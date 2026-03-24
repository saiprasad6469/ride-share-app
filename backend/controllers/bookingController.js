const Booking = require("../models/Booking");
const Ride = require("../models/Ride");

const createBooking = async (req, res) => {
  try {
    const { rideId, seatsBooked, passengerName, passengerPhone } = req.body;

    if (!rideId || !seatsBooked || !passengerName || !passengerPhone) {
      return res.status(400).json({
        success: false,
        message: "All booking fields are required",
      });
    }

    const seatsToBook = Number(seatsBooked);

    if (Number.isNaN(seatsToBook) || seatsToBook < 1) {
      return res.status(400).json({
        success: false,
        message: "Seats booked must be at least 1",
      });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot book your own ride",
      });
    }

    if (ride.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Ride is not available for booking",
      });
    }

    if (ride.availableSeats < seatsToBook) {
      return res.status(400).json({
        success: false,
        message: `Only ${ride.availableSeats} seat(s) left`,
      });
    }

    const totalAmount = seatsToBook * Number(ride.pricePerSeat);

    const booking = await Booking.create({
      ride: ride._id,
      bookedBy: req.user._id,
      seatsBooked: seatsToBook,
      passengerName: passengerName.trim(),
      passengerPhone: passengerPhone.trim(),
      totalAmount,
      status: "confirmed",
    });

    // reduce seats automatically
    ride.availableSeats = ride.availableSeats - seatsToBook;
    await ride.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: "ride",
        populate: {
          path: "postedBy",
          select: "name email avatar phone",
        },
      })
      .populate("bookedBy", "name email avatar phone");

    res.status(201).json({
      success: true,
      message: "Ride booked successfully",
      booking: populatedBooking,
      seatsLeft: ride.availableSeats,
    });
  } catch (error) {
    console.error("Create booking error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while booking ride",
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ bookedBy: req.user._id })
      .populate({
        path: "ride",
        populate: {
          path: "postedBy",
          select: "name email avatar phone",
        },
      })
      .populate("bookedBy", "name email avatar phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("ride");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.bookedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this booking",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    // restore seats
    const ride = await Ride.findById(booking.ride._id);
    if (ride) {
      ride.availableSeats += booking.seatsBooked;
      await ride.save();
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while cancelling booking",
    });
  }
};

const getBookingsForMyPostedRides = async (req, res) => {
  try {
    const myRides = await Ride.find({ postedBy: req.user._id }).select("_id");
    const rideIds = myRides.map((ride) => ride._id);

    const bookings = await Booking.find({
      ride: { $in: rideIds },
      status: "confirmed",
    })
      .populate("bookedBy", "name email avatar phone")
      .populate("ride")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings for my rides error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching booked persons",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookingsForMyPostedRides,
};