import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

function MyPostedRides() {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();

  const fetchMyRides = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/rides/user/my-rides", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRides(res.data.rides || []);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRide = async (rideId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(`http://localhost:5000/api/rides/${rideId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);
      fetchMyRides();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete ride");
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  return (
    <>
      <Navbar />
      <div className="page page-with-bottomnav">
        <div className="container">
          <h2 className="section-title">My Posted Rides</h2>

          {rides.length === 0 ? (
            <p className="subtle-text">You have not posted any rides yet.</p>
          ) : (
            <div className="ride-list">
              {rides.map((ride) => (
                <div className="ride-card" key={ride._id}>
                  <div className="ride-top">
                    <div>
                      <div className="route">
                        {ride.from} → {ride.to}
                      </div>
                      <div className="meta">{ride.date} • {ride.time}</div>
                      <div className="meta">{ride.carModel} • {ride.carNumber}</div>
                    </div>
                    <div className="price">₹{ride.pricePerSeat}</div>
                  </div>

                  <div className="ride-actions">
                    <button
                      className="btn btn-outline"
                      onClick={() => navigate(`/ride/${ride._id}`)}
                    >
                      View Ride
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={() => deleteRide(ride._id)}
                    >
                      Delete Ride
                    </button>
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

export default MyPostedRides;