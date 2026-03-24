import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function TrackRide() {
  const location = useLocation();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [routeWarning, setRouteWarning] = useState("");

  const [mapData, setMapData] = useState({
    sourceCoords: null,
    destCoords: null,
    center: [20.5937, 78.9629],
  });

  const normalizeText = (value) => (value || "").trim().toLowerCase();

  const getBestRoutePlaces = (rideData) => {
    const from = (rideData?.from || "").trim();
    const to = (rideData?.to || "").trim();
    const pickupLocation = (rideData?.pickupLocation || "").trim();
    const dropLocation = (rideData?.dropLocation || "").trim();

    let sourcePlace = pickupLocation || from;
    let destPlace = dropLocation || to;

    // if both are accidentally same, fallback destination to `to`
    if (
      sourcePlace &&
      destPlace &&
      normalizeText(sourcePlace) === normalizeText(destPlace)
    ) {
      if (to && normalizeText(to) !== normalizeText(sourcePlace)) {
        destPlace = to;
      } else if (from && to && normalizeText(from) !== normalizeText(to)) {
        sourcePlace = from;
        destPlace = to;
      }
    }

    return { sourcePlace, destPlace };
  };

  const geocodePlace = async (placeName) => {
    try {
      if (!placeName) return null;

      const query = `${placeName}, India`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(
          query
        )}`
      );

      const data = await res.json();

      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }

      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const fetchRideById = async (rideId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/rides/${rideId}`);
      const fetchedRide = res.data.ride;
      setRide(fetchedRide);
      localStorage.setItem("currentTrackRide", JSON.stringify(fetchedRide));
      await prepareMap(fetchedRide);
    } catch (error) {
      console.error("Failed to fetch ride by id:", error);
      setRide(null);
    }
  };

  const prepareMap = async (rideData) => {
    if (!rideData) return;

    const { sourcePlace, destPlace } = getBestRoutePlaces(rideData);

    if (!sourcePlace || !destPlace) return;

    if (normalizeText(sourcePlace) === normalizeText(destPlace)) {
      setRouteWarning(
        "Pickup and drop locations are the same in this ride. Please check the posted ride details."
      );
    } else {
      setRouteWarning("");
    }

    const sourceCoords = await geocodePlace(sourcePlace);
    const destCoords = await geocodePlace(destPlace);

    let center = [20.5937, 78.9629];

    if (sourceCoords && destCoords) {
      center = [
        (sourceCoords[0] + destCoords[0]) / 2,
        (sourceCoords[1] + destCoords[1]) / 2,
      ];
    } else if (sourceCoords) {
      center = sourceCoords;
    } else if (destCoords) {
      center = destCoords;
    }

    setMapData({
      sourceCoords,
      destCoords,
      center,
    });
  };

  useEffect(() => {
    const initTrackRide = async () => {
      try {
        setLoading(true);

        const stateRide = location.state?.ride;
        const storedRide = localStorage.getItem("currentTrackRide");
        const params = new URLSearchParams(location.search);
        const rideId = params.get("rideId");

        if (stateRide) {
          setRide(stateRide);
          localStorage.setItem("currentTrackRide", JSON.stringify(stateRide));
          await prepareMap(stateRide);
          return;
        }

        if (storedRide) {
          const parsedRide = JSON.parse(storedRide);
          if (parsedRide?._id || parsedRide?.from || parsedRide?.pickupLocation) {
            setRide(parsedRide);
            await prepareMap(parsedRide);
            return;
          }
        }

        if (rideId) {
          await fetchRideById(rideId);
          return;
        }

        setRide(null);
      } catch (error) {
        console.error("TrackRide init error:", error);
        setRide(null);
      } finally {
        setLoading(false);
      }
    };

    initTrackRide();
  }, [location.state, location.search]);

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

  const calculateETA = () => {
    if (!mapData.sourceCoords || !mapData.destCoords) return "Not available";

    const latDiff = mapData.sourceCoords[0] - mapData.destCoords[0];
    const lngDiff = mapData.sourceCoords[1] - mapData.destCoords[1];
    const approxDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;

    const avgSpeedKmH = 50;
    const etaHours = approxDistance / avgSpeedKmH;
    const etaMinutes = Math.max(10, Math.round(etaHours * 60));

    return `${etaMinutes} mins`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page page-with-bottomnav">
          <div className="container">
            <h2 className="section-title">Track Your Ride</h2>
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
            <h2 className="section-title">Track Your Ride</h2>
            <p className="subtle-text">No ride selected for tracking.</p>
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

  const { sourcePlace, destPlace } = getBestRoutePlaces(ride);

  return (
    <>
      <Navbar />

      <div className="page page-with-bottomnav">
        <div className="container">
          <h2 className="section-title">Track Your Ride</h2>

          {routeWarning && (
            <div
              style={{
                background: "#fff4e5",
                border: "1px solid #ffd59e",
                color: "#8a5a00",
                padding: "12px 14px",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              {routeWarning}
            </div>
          )}

          <div
            className="map-box"
            style={{
              height: "360px",
              borderRadius: "18px",
              overflow: "hidden",
              marginBottom: "20px",
            }}
          >
            <MapContainer
              center={mapData.center}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {mapData.sourceCoords && (
                <Marker position={mapData.sourceCoords}>
                  <Popup>Pickup: {sourcePlace}</Popup>
                </Marker>
              )}

              {mapData.destCoords && (
                <Marker position={mapData.destCoords}>
                  <Popup>Drop: {destPlace}</Popup>
                </Marker>
              )}

              {mapData.sourceCoords && mapData.destCoords && (
                <Polyline positions={[mapData.sourceCoords, mapData.destCoords]} />
              )}
            </MapContainer>
          </div>

          <div className="track-panel">
            <div className="track-row">
              <div>
                <strong>Route:</strong> {sourcePlace} → {destPlace}
              </div>
              <div>
                <strong>ETA:</strong> {calculateETA()}
              </div>
            </div>

            <div className="track-row">
              <div>
                <strong>Pickup:</strong> {sourcePlace}
              </div>
              <div>
                <strong>Drop:</strong> {destPlace}
              </div>
            </div>

            <div className="track-row">
              <div>
                <strong>Date:</strong> {formatDate(ride.date)}
              </div>
              <div>
                <strong>Time:</strong> {formatTime(ride.time)}
              </div>
            </div>

            <div className="track-row">
              <div>
                <strong>Posted By:</strong> {ride.postedBy?.name || "Unknown"}
              </div>
              <div>
                <strong>Fare:</strong> ₹{ride.pricePerSeat}
              </div>
            </div>

            <div className="track-row">
              <div>
                <strong>Vehicle:</strong> {ride.carModel} ({ride.carNumber})
              </div>
              <div>
                <strong>Seats Left:</strong> {ride.availableSeats}
              </div>
            </div>

            <div className="track-row">
              <div>
                <strong>Contact:</strong> {ride.mobileNumber || "Not available"}
              </div>
              <div>
                <strong>Status:</strong> {ride.status}
              </div>
            </div>

            {ride.description && (
              <div className="track-row">
                <div>
                  <strong>Description:</strong> {ride.description}
                </div>
              </div>
            )}

            <div className="ride-actions">
              <button
                className="btn btn-primary"
                onClick={() =>
                  navigator.share
                    ? navigator.share({
                        title: "ShareRide Tracking",
                        text: `Tracking ride from ${sourcePlace} to ${destPlace}`,
                        url: window.location.href,
                      })
                    : alert("Sharing is not supported on this device")
                }
              >
                Share Ride Status
              </button>

              <button
                className="btn btn-outline"
                onClick={() => alert("SOS feature can be connected next.")}
              >
                Send SOS
              </button>

              <button
                className="btn btn-outline"
                onClick={() => alert("Report feature can be connected next.")}
              >
                Report Ride
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default TrackRide;