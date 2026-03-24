import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function RideDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRideDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/rides/${id}`);
      setRide(res.data.ride);
    } catch (error) {
      console.error("Error fetching ride details:", error);
      setRide(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRideDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hour, minute] = timeString.split(":");
    const d = new Date();
    d.setHours(hour, minute);
    return d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleBookRide = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/");
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const bookingData = {
        rideId: ride._id,
        seatsBooked: 1,
        passengerName: storedUser.name || "Passenger",
        passengerPhone: storedUser.phone || "9999999999",
      };

      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      navigate("/my-bookings");
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page page-with-bottomnav">
          <div className="container">
            <h2 className="section-title">Ride Details</h2>
            <p className="subtle-text">Loading ride details...</p>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  if (!ride) {
    return (
      <>
        <Navbar />
        <div className="page page-with-bottomnav">
          <div className="container">
            <h2 className="section-title">Ride Details</h2>
            <p className="subtle-text">Ride not found.</p>

            <div style={{ marginTop: "20px" }}>
              <button className="btn btn-primary" onClick={() => navigate("/search")}>
                Back to Search
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="page page-with-bottomnav">
        <div className="container">
          <h2 className="section-title">Ride Details</h2>

          <div className="ride-card">
            <div className="ride-top">
              <div>
                <div className="route">
                  {ride.from} → {ride.to}
                </div>

                <div className="meta">Date: {formatDate(ride.date)}</div>
                <div className="meta">Time: {formatTime(ride.time)}</div>
                <div className="meta">
                  Driver: {ride.postedBy?.name || "Unknown Driver"}
                </div>
                <div className="meta">
                  Driver Email: {ride.postedBy?.email || "Not available"}
                </div>
                <div className="meta">
                  Mobile Number: {ride.mobileNumber || "Not available"}
                </div>
                <div className="meta">
                  Vehicle: {ride.carModel} ({ride.carNumber})
                </div>
                <div className="meta">
                  Seats Available: {ride.availableSeats}
                </div>
                <div className="meta">
                  Status: {ride.status}
                </div>

                {ride.description && (
                  <div className="meta" style={{ marginTop: "10px" }}>
                    Description: {ride.description}
                  </div>
                )}
              </div>

              <div className="price">₹{ride.pricePerSeat}</div>
            </div>

            <div className="ride-tag-row">
              <span className="ride-tag">
                {ride.availableSeats} {ride.availableSeats === 1 ? "Seat" : "Seats"} left
              </span>
              <span className="ride-tag">{ride.carModel}</span>
              <span className="ride-tag">{ride.status}</span>
              <span className="ride-tag">Verified User</span>
            </div>

            <div className="ride-actions">
              <button className="btn btn-primary" onClick={handleBookRide}>
                Book Ride
              </button>

              <button
  className="btn btn-outline"
  onClick={() => {
    localStorage.setItem("currentTrackRide", JSON.stringify(ride));
    navigate("/track", { state: { ride } });
  }}
>
  Track Ride
</button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default RideDetails;