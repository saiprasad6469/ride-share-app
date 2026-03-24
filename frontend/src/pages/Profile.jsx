import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [myRides, setMyRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [receivedBookings, setReceivedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("posted");

  const [showBookedPersonsBox, setShowBookedPersonsBox] = useState(false);
  const [selectedRideBookings, setSelectedRideBookings] = useState([]);
  const [selectedRideRoute, setSelectedRideRoute] = useState("");

  const fetchProfileData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      const userRes = await axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(userRes.data.user);
    } catch (error) {
      console.error("User fetch error:", error.response?.data || error.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      return;
    }

    try {
      const ridesRes = await axios.get("http://localhost:5000/api/rides/user/my-rides", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyRides(ridesRes.data.rides || []);
    } catch (error) {
      console.error("My rides fetch error:", error.response?.data || error.message);
      setMyRides([]);
    }

    try {
      const bookingsRes = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyBookings(bookingsRes.data.bookings || []);
    } catch (error) {
      console.error("Bookings fetch error:", error.response?.data || error.message);
      setMyBookings([]);
    }

    try {
      const receivedRes = await axios.get("http://localhost:5000/api/bookings/received-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReceivedBookings(receivedRes.data.bookings || []);
    } catch (error) {
      console.error("Received bookings fetch error:", error.response?.data || error.message);
      setReceivedBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", file);

      setUploading(true);

      const res = await axios.put(
        "http://localhost:5000/api/auth/upload-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data.user);
      alert("Profile image updated successfully");
    } catch (error) {
      console.error("Avatar upload error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
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
      fetchProfileData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking");
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
      fetchProfileData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete ride");
    }
  };

  const showBookedPersons = (ride) => {
    const bookingsForRide = receivedBookings.filter(
      (booking) => booking.ride?._id === ride._id
    );

    setSelectedRideBookings(bookingsForRide);
    setSelectedRideRoute(`${ride.from} → ${ride.to}`);
    setShowBookedPersonsBox(true);
  };

  const closeBookedPersonsBox = () => {
    setShowBookedPersonsBox(false);
    setSelectedRideBookings([]);
    setSelectedRideRoute("");
  };

 const openTrackRide = (ride) => {
  localStorage.setItem("currentTrackRide", JSON.stringify(ride));
  navigate("/track", { state: { ride } });
};

  const formatJoinedDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  const formatRideDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatRideTime = (timeString) => {
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

  const getFirstLetter = (name) => {
    if (!name) return "U";
    return name.trim().charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page page-with-bottomnav">
          <div className="container">
            <h2 className="section-title">My Profile</h2>
            <p className="subtle-text">Loading profile...</p>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="page page-with-bottomnav">
          <div className="container">
            <h2 className="section-title">My Profile</h2>
            <p className="subtle-text">Unable to load profile.</p>
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
          <h2 className="section-title">My Profile</h2>

          <div className="profile-card">
            <div className="profile-top" style={{ alignItems: "center", gap: "18px" }}>
              <div
                className="profile-avatar"
                style={{
                  width: "86px",
                  height: "86px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  fontWeight: "700",
                  background: "#e8f1ff",
                  color: "#2563eb",
                  border: "2px solid #dbeafe",
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  getFirstLetter(user.name)
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h3 className="profile-name">{user.name}</h3>
                <p className="profile-role">ShareRide Member</p>

                <div className="profile-meta">
                  <span>📧 {user.email}</span>
                  {user.phone && <span>📞 {user.phone}</span>}
                  {user.city && <span>📍 {user.city}</span>}
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className="btn btn-outline"
                    onClick={handleChooseImage}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload New Image"}
                  </button>

                  <button className="btn btn-primary" onClick={handleEditProfile}>
                    Edit Profile
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <p className="subtle-text">
                {user.bio
                  ? user.bio
                  : "Welcome to your ShareRide profile. You can manage your account, posted rides, and booked rides here."}
              </p>
            </div>
          </div>

          <h3 className="section-title">Profile Overview</h3>

          <div className="profile-grid">
            <div className="profile-info-card">
              <h4>Member Since</h4>
              <p>{formatJoinedDate(user.createdAt)}</p>
            </div>

            <div className="profile-info-card">
              <h4>Account Status</h4>
              <p>Verified</p>
            </div>

            <div className="profile-info-card">
              <h4>Total Posted Rides</h4>
              <p>{myRides.length}</p>
            </div>

            <div className="profile-info-card">
              <h4>Total Bookings</h4>
              <p>{myBookings.length}</p>
            </div>
          </div>

          <h3 className="section-title">My Activity</h3>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "18px",
              flexWrap: "wrap",
            }}
          >
            <button
              className={`btn ${activeTab === "posted" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setActiveTab("posted")}
            >
              Posted Rides
            </button>

            <button
              className={`btn ${activeTab === "booked" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setActiveTab("booked")}
            >
              Booked Rides
            </button>
          </div>

          {activeTab === "posted" && (
            <>
              {myRides.length === 0 ? (
                <div className="profile-info-card">
                  <p>You have not posted any rides yet.</p>
                </div>
              ) : (
                <div className="ride-list">
                  {myRides.map((ride) => (
                    <div className="ride-card" key={ride._id}>
                      <div className="ride-top">
                        <div>
                          <div className="route">
                            {ride.from} → {ride.to}
                          </div>
                          <div className="meta">
                            📅 {formatRideDate(ride.date)} | ⏰ {formatRideTime(ride.time)}
                          </div>
                          <div className="meta">
                            🚗 {ride.carModel} | 🚘 {ride.carNumber}
                          </div>
                          <div className="meta">📞 {ride.mobileNumber}</div>
                          <div className="meta">Seats Left: {ride.availableSeats}</div>
                        </div>

                        <div className="price">₹{ride.pricePerSeat} / seat</div>
                      </div>

                      <div className="ride-tag-row">
                        <span className="ride-tag">
                          {ride.availableSeats} {ride.availableSeats === 1 ? "Seat" : "Seats"}
                        </span>
                        <span className="ride-tag">{ride.status}</span>
                        <span className="ride-tag">{ride.carModel}</span>
                      </div>

                      <div className="ride-actions">
                        <button
                          className="btn btn-outline"
                          onClick={() => navigate(`/ride/${ride._id}`)}
                        >
                          View Ride
                        </button>

                        <button
                          className="btn btn-outline"
                          onClick={() => openTrackRide(ride)}
                        >
                          Track Ride
                        </button>

                        <button
                          className="btn btn-outline"
                          onClick={() => showBookedPersons(ride)}
                        >
                          Booked Persons
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
            </>
          )}

          {activeTab === "booked" && (
            <>
              {myBookings.length === 0 ? (
                <div className="profile-info-card">
                  <p>You have not booked any rides yet.</p>
                </div>
              ) : (
                <div className="ride-list">
                  {myBookings
                    .filter((booking) => booking.ride)
                    .map((booking) => (
                      <div className="ride-card" key={booking._id}>
                        <div className="ride-top">
                          <div>
                            <div className="route">
                              {booking.ride.from} → {booking.ride.to}
                            </div>
                            <div className="meta">
                              📅 {formatRideDate(booking.ride.date)} | ⏰ {formatRideTime(booking.ride.time)}
                            </div>
                            <div className="meta">
                              Posted By: {booking.ride.postedBy?.name || "Unknown"}
                            </div>
                            <div className="meta">
                              Contact: {booking.ride.mobileNumber || "Not available"}
                            </div>
                            <div className="meta">
                              Seats Booked: {booking.seatsBooked}
                            </div>
                            <div className="meta">
                              Current Seats Left: {booking.ride.availableSeats}
                            </div>
                          </div>

                          <div className="price">₹{booking.totalAmount}</div>
                        </div>

                        <div className="ride-tag-row">
                          <span className="ride-tag">{booking.status}</span>
                          <span className="ride-tag">{booking.ride.carModel || "Vehicle"}</span>
                          <span className="ride-tag">
                            {booking.ride.postedBy?.name || "User"}
                          </span>
                        </div>

                        <div className="ride-actions">
                          <button
                            className="btn btn-outline"
                            onClick={() => navigate(`/ride/${booking.ride._id}`)}
                          >
                            View Ride
                          </button>

                          <button
                            className="btn btn-outline"
                            onClick={() => openTrackRide(booking.ride)}
                          >
                            Track Ride
                          </button>

                          {booking.status === "confirmed" ? (
                            <button
                              className="btn btn-primary"
                              onClick={() => cancelBooking(booking._id)}
                            >
                              Cancel Booking
                            </button>
                          ) : (
                            <button className="btn btn-outline" disabled>
                              Cancelled
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}

          <h3 className="section-title">Account Details</h3>

          <div className="profile-grid">
            <div className="profile-info-card">
              <h4>Name</h4>
              <p>{user.name}</p>
            </div>

            <div className="profile-info-card">
              <h4>Email</h4>
              <p>{user.email}</p>
            </div>

            <div className="profile-info-card">
              <h4>Phone</h4>
              <p>{user.phone || "Not added"}</p>
            </div>

            <div className="profile-info-card">
              <h4>City</h4>
              <p>{user.city || "Not added"}</p>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-primary" onClick={handleEditProfile}>
              Edit Profile
            </button>

            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {showBookedPersonsBox && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "20px",
          }}
          onClick={closeBookedPersonsBox}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "500px",
              borderRadius: "18px",
              padding: "22px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0 }}>Booked Persons</h3>
              <button className="btn btn-outline" onClick={closeBookedPersonsBox}>
                Close
              </button>
            </div>

            <p className="subtle-text" style={{ marginBottom: "18px" }}>
              Ride: {selectedRideRoute}
            </p>

            {selectedRideBookings.length === 0 ? (
              <div className="profile-info-card">
                <p>No one has booked this ride yet.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {selectedRideBookings.map((booking) => (
                  <div
                    key={booking._id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      padding: "14px",
                      background: "#f9fafb",
                    }}
                  >
                    <p style={{ margin: "0 0 6px 0", fontWeight: "600" }}>
                      {booking.passengerName}
                    </p>
                    <p style={{ margin: "0 0 6px 0" }}>
                      Mobile: {booking.passengerPhone}
                    </p>
                    <p style={{ margin: "0" }}>
                      Seats Booked: {booking.seatsBooked}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default Profile;