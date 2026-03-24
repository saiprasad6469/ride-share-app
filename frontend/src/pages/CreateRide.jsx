import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

function CreateRide() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    pickupLocation: "",
    dropLocation: "",
    date: "",
    time: "",
    availableSeats: "",
    pricePerSeat: "",
    carModel: "",
    carNumber: "",
    mobileNumber: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateLocationFormat = (value) => {
    // simple check: at least 3 comma-separated parts
    const parts = value.split(",").map((item) => item.trim()).filter(Boolean);
    return parts.length >= 3;
  };

  const handleCreateRide = async (rideStatus) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      if (!validateLocationFormat(formData.from)) {
        alert("From location must be in format: City, State, Country");
        return;
      }

      if (!validateLocationFormat(formData.to)) {
        alert("To location must be in format: City, State, Country");
        return;
      }

      if (!validateLocationFormat(formData.pickupLocation)) {
        alert("Pickup Location must be in format: Place, City, State, Country");
        return;
      }

      if (!validateLocationFormat(formData.dropLocation)) {
        alert("Drop Location must be in format: Place, City, State, Country");
        return;
      }

      const payload = {
        from: formData.from.trim(),
        to: formData.to.trim(),
        pickupLocation: formData.pickupLocation.trim(),
        dropLocation: formData.dropLocation.trim(),
        date: formData.date,
        time: formData.time,
        availableSeats: Number(formData.availableSeats),
        pricePerSeat: Number(formData.pricePerSeat),
        carModel: formData.carModel.trim(),
        carNumber: formData.carNumber.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        description: formData.description.trim(),
        status: rideStatus,
      };

      const res = await axios.post("http://localhost:5000/api/rides", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);

      setFormData({
        from: "",
        to: "",
        pickupLocation: "",
        dropLocation: "",
        date: "",
        time: "",
        availableSeats: "",
        pricePerSeat: "",
        carModel: "",
        carNumber: "",
        mobileNumber: "",
        description: "",
      });
    } catch (error) {
      console.error("Create ride error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create ride");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page page-with-bottomnav">
        <div className="container">
          <section className="create-ride-banner">
            <h2>Publish your ride and fill your empty seats</h2>
            <p className="subtle-text">
              Enter locations clearly in this format:
              <br />
              <strong>City, State, Country</strong>
              <br />
              Example: <strong>Bengaluru, Karnataka, India</strong>
            </p>
          </section>

          <section className="form-card">
            <div className="form-grid">
              <div>
                <label className="label">From</label>
                <input
                  className="input"
                  name="from"
                  placeholder="Ex: Bengaluru, Karnataka, India"
                  value={formData.from}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">To</label>
                <input
                  className="input"
                  name="to"
                  placeholder="Ex: Hyderabad, Telangana, India"
                  value={formData.to}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">Pickup Location</label>
                <input
                  className="input"
                  name="pickupLocation"
                  placeholder="Ex: Majestic Bus Stand, Bengaluru, Karnataka, India"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">Drop Location</label>
                <input
                  className="input"
                  name="dropLocation"
                  placeholder="Ex: Ameerpet Metro Station, Hyderabad, Telangana, India"
                  value={formData.dropLocation}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">Date</label>
                <input
                  className="input"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">Time</label>
                <input
                  className="input"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">Available seats</label>
                <input
                  className="input"
                  type="number"
                  name="availableSeats"
                  placeholder="Enter seats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <div>
                <label className="label">Price per seat (₹)</label>
                <input
                  className="input"
                  type="number"
                  name="pricePerSeat"
                  placeholder="Enter price"
                  value={formData.pricePerSeat}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div>
                <label className="label">Car model</label>
                <input
                  className="input"
                  name="carModel"
                  placeholder="Ex: Tata Nexon"
                  value={formData.carModel}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">Car number</label>
                <input
                  className="input"
                  name="carNumber"
                  placeholder="Ex: TS09AB1234"
                  value={formData.carNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">Mobile number</label>
                <input
                  className="input"
                  type="tel"
                  name="mobileNumber"
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ marginTop: "18px" }}>
              <label className="label">Ride description</label>
              <textarea
                className="textarea"
                name="description"
                placeholder="Add pickup instructions, luggage info, or route notes"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div
              style={{
                marginTop: "22px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleCreateRide("published")}
              >
                Publish Ride
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleCreateRide("draft")}
              >
                Save as Draft
              </button>
            </div>
          </section>
        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default CreateRide;