const Ride = require("../models/Ride");

const getRideDateTime = (date, time) => new Date(`${date}T${time}:00`);

const createRide = async (req, res) => {
  try {
    const {
      from,
      to,
      pickupLocation,
      dropLocation,
      date,
      time,
      availableSeats,
      pricePerSeat,
      carModel,
      carNumber,
      mobileNumber,
      description,
      status,
    } = req.body;

    if (
      !from ||
      !to ||
      !pickupLocation ||
      !dropLocation ||
      !date ||
      !time ||
      availableSeats === undefined ||
      pricePerSeat === undefined ||
      !carModel ||
      !carNumber ||
      !mobileNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const ride = await Ride.create({
      from: from.trim(),
      to: to.trim(),
      pickupLocation: pickupLocation.trim(),
      dropLocation: dropLocation.trim(),
      date,
      time,
      availableSeats: Number(availableSeats),
      pricePerSeat: Number(pricePerSeat),
      carModel: carModel.trim(),
      carNumber: carNumber.trim().toUpperCase(),
      mobileNumber: mobileNumber.trim(),
      description: description ? description.trim() : "",
      status: status || "published",
      postedBy: req.user._id,
    });

    const populatedRide = await Ride.findById(ride._id).populate(
      "postedBy",
      "name email avatar phone"
    );

    return res.status(201).json({
      success: true,
      message:
        status === "draft"
          ? "Ride saved as draft successfully"
          : "Ride published successfully",
      ride: populatedRide,
    });
  } catch (error) {
    console.error("Create ride error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while creating ride",
    });
  }
};

const getAllPublishedRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: "published" })
      .populate("postedBy", "name email avatar phone")
      .sort({ createdAt: -1 });

    const now = new Date();

    const upcomingRides = rides.filter((ride) => {
      const rideDateTime = new Date(`${ride.date}T${ride.time}:00`);
      return rideDateTime >= now;
    });

    return res.status(200).json({
      success: true,
      count: upcomingRides.length,
      rides: upcomingRides,
    });
  } catch (error) {
    console.error("Get published rides error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching rides",
    });
  }
};

const searchRides = async (req, res) => {
  try {
    const { from, to, date, sortPrice, seats, timeSlot } = req.query;

    let rides = await Ride.find({ status: "published" })
      .populate("postedBy", "name email avatar")
      .sort({ createdAt: -1 });

    const now = new Date();

    rides = rides.filter((ride) => getRideDateTime(ride.date, ride.time) >= now);

    if (from) {
      rides = rides.filter((ride) =>
        ride.from.toLowerCase().includes(from.toLowerCase())
      );
    }

    if (to) {
      rides = rides.filter((ride) =>
        ride.to.toLowerCase().includes(to.toLowerCase())
      );
    }

    if (date) {
      rides = rides.filter((ride) => ride.date === date);
    }

    if (seats === "1") rides = rides.filter((ride) => ride.availableSeats === 1);
    if (seats === "2") rides = rides.filter((ride) => ride.availableSeats === 2);
    if (seats === "3+") rides = rides.filter((ride) => ride.availableSeats >= 3);

    if (timeSlot) {
      rides = rides.filter((ride) => {
        const hour = parseInt(ride.time.split(":")[0], 10);
        if (timeSlot === "Morning") return hour >= 5 && hour < 12;
        if (timeSlot === "Afternoon") return hour >= 12 && hour < 17;
        if (timeSlot === "Evening") return hour >= 17 && hour <= 23;
        return true;
      });
    }

    if (sortPrice === "Low to High") {
      rides.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
    } else if (sortPrice === "High to Low") {
      rides.sort((a, b) => b.pricePerSeat - a.pricePerSeat);
    }

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    console.error("Search rides error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while searching rides",
    });
  }
};

const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate(
      "postedBy",
      "name email avatar phone"
    );

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    return res.status(200).json({
      success: true,
      ride,
    });
  } catch (error) {
    console.error("Get ride by id error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching ride",
    });
  }
};

const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ postedBy: req.user._id })
      .populate("postedBy", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      rides,
    });
  } catch (error) {
    console.error("Get my rides error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching your rides",
    });
  }
};

const updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this ride",
      });
    }

    const updatedRide = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("postedBy", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Ride updated successfully",
      ride: updatedRide,
    });
  } catch (error) {
    console.error("Update ride error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating ride",
    });
  }
};

const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this ride",
      });
    }

    await Ride.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Ride deleted successfully",
    });
  } catch (error) {
    console.error("Delete ride error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting ride",
    });
  }
};

module.exports = {
  createRide,
  getAllPublishedRides,
  searchRides,
  getRideById,
  getMyRides,
  updateRide,
  deleteRide,
};