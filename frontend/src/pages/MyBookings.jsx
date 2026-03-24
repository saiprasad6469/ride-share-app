import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/bookings/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <Navbar />
      <div className="page page-with-bottomnav">
        <div className="container">
          <h2 className="section-title">My Booked Rides</h2>

          {bookings.length === 0 ? (
            <p className="subtle-text">No booked rides yet.</p>
          ) : (
            <div className="ride-list">
              {bookings.map((booking) => (
                <div className="ride-card" key={booking._id}>
                  <div className="ride-top">
                    <div>
                      <div className="route">
                        {booking.ride?.from} → {booking.ride?.to}
                      </div>
                      <div className="meta">Posted By: {booking.ride?.postedBy?.name}</div>
                      <div className="meta">Seats Booked: {booking.seatsBooked}</div>
                      <div className="meta">Status: {booking.status}</div>
                    </div>
                    <div className="price">₹{booking.totalAmount}</div>
                  </div>

                  <div className="ride-actions">
                    {booking.status === "confirmed" && (
                      <button
                        className="btn btn-outline"
                        onClick={() => cancelBooking(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}

export default MyBookings;