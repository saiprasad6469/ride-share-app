import { useNavigate } from "react-router-dom";

function RideCard({ ride }) {
  const navigate = useNavigate();

  if (!ride) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="ride-card">
      <div className="ride-top">
        <div>
          <div className="route">
            {ride.from} → {ride.to}
          </div>

          <div className="meta">
            Driver: {ride.postedBy?.name || "Unknown Driver"}
          </div>

          <div className="meta">
            {formatDate(ride.date)} • {formatTime(ride.time)} • {ride.carModel}
          </div>

          <div className="meta">
            Car Number: {ride.carNumber}
          </div>

          <div className="meta">
            Contact: {ride.mobileNumber || "Not available"}
          </div>

          {ride.description && (
            <div className="meta">
              Info: {ride.description}
            </div>
          )}
        </div>

        <div className="price">₹{ride.pricePerSeat}</div>
      </div>

      <div className="ride-tag-row">
        <span className="ride-tag">
          {ride.availableSeats} {ride.availableSeats === 1 ? "seat" : "seats"} left
        </span>
        <span className="ride-tag">{ride.carModel}</span>
        <span className="ride-tag">Instant booking</span>
        <span className="ride-tag">Verified user</span>
      </div>

      <div className="ride-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/ride/${ride._id}`)}
        >
          View Details
        </button>

        <button
          className="btn btn-outline"
          onClick={() =>
            alert(
              `Driver: ${ride.postedBy?.name || "Unknown"}\nMobile: ${
                ride.mobileNumber || "Not available"
              }`
            )
          }
        >
          Contact Driver
        </button>
      </div>
    </div>
  );
}

export default RideCard;