import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import RideCard from "../components/RideCard";

function SearchRide() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    date: "",
    sortPrice: "",
    seats: "",
    timeSlot: "",
  });

  const fetchAllRides = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/rides");
      setRides(res.data.rides || []);
    } catch (error) {
      console.error("Error fetching rides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();

      if (filters.from) queryParams.append("from", filters.from);
      if (filters.to) queryParams.append("to", filters.to);
      if (filters.date) queryParams.append("date", filters.date);
      if (filters.sortPrice) queryParams.append("sortPrice", filters.sortPrice);
      if (filters.seats) queryParams.append("seats", filters.seats);
      if (filters.timeSlot) queryParams.append("timeSlot", filters.timeSlot);

      const res = await axios.get(
        `http://localhost:5000/api/rides/search?${queryParams.toString()}`
      );

      setRides(res.data.rides || []);
    } catch (error) {
      console.error("Error searching rides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleQuickRoute = (from, to) => {
    setFilters((prev) => ({
      ...prev,
      from,
      to,
    }));
  };

  const clearFilters = () => {
    setFilters({
      from: "",
      to: "",
      date: "",
      sortPrice: "",
      seats: "",
      timeSlot: "",
    });
    fetchAllRides();
  };

  useEffect(() => {
    fetchAllRides();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page page-with-bottomnav">
        <div className="container">
          <section className="search-hero">
            <div className="search-hero-top">
              <div>
                <h2>Find the perfect ride for your journey</h2>
                <p className="subtle-text">
                  Search by route, date, price, and seats to quickly book a safe
                  and affordable carpool ride.
                </p>
              </div>

              <button className="btn btn-secondary" onClick={fetchAllRides}>
                Explore Popular Trips
              </button>
            </div>

            <div className="search-box-grid">
              <input
                className="input"
                name="from"
                placeholder="From city"
                value={filters.from}
                onChange={handleChange}
              />
              <input
                className="input"
                name="to"
                placeholder="To city"
                value={filters.to}
                onChange={handleChange}
              />
              <input
                className="input"
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
              />
              <button className="btn btn-primary" onClick={handleSearch}>
                Search Ride
              </button>
            </div>

            <div className="quick-routes">
              <button
                className="route-pill"
                onClick={() => handleQuickRoute("Hyderabad", "Pune")}
              >
                Hyderabad → Pune
              </button>
              <button
                className="route-pill"
                onClick={() => handleQuickRoute("Hyderabad", "Bangalore")}
              >
                Hyderabad → Bangalore
              </button>
              <button
                className="route-pill"
                onClick={() => handleQuickRoute("Mumbai", "Pune")}
              >
                Mumbai → Pune
              </button>
              <button
                className="route-pill"
                onClick={() => handleQuickRoute("Delhi", "Jaipur")}
              >
                Delhi → Jaipur
              </button>
              <button
                className="route-pill"
                onClick={() => handleQuickRoute("Chennai", "Hyderabad")}
              >
                Chennai → Hyderabad
              </button>
            </div>
          </section>

          <section className="filter-bar">
            <select
              className="select-input"
              name="sortPrice"
              value={filters.sortPrice}
              onChange={handleChange}
            >
              <option value="">Sort by price</option>
              <option>Low to High</option>
              <option>High to Low</option>
            </select>

            <select
              className="select-input"
              name="seats"
              value={filters.seats}
              onChange={handleChange}
            >
              <option value="">Available seats</option>
              <option value="1">1 Seat</option>
              <option value="2">2 Seats</option>
              <option value="3+">3+ Seats</option>
            </select>

            <select
              className="select-input"
              name="timeSlot"
              value={filters.timeSlot}
              onChange={handleChange}
            >
              <option value="">Departure time</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>

            <button className="btn btn-outline" onClick={clearFilters}>
              Clear Filters
            </button>
          </section>

          <section className="info-strip">
            <div className="info-box">
              <h4>Affordable rides</h4>
              <p>Compare price per seat and pick the trip that matches your budget.</p>
            </div>

            <div className="info-box">
              <h4>Verified drivers</h4>
              <p>Book trips posted by registered users with clear vehicle details.</p>
            </div>

            <div className="info-box">
              <h4>Flexible booking</h4>
              <p>Choose date, route, and available seats with a simple booking flow.</p>
            </div>
          </section>

          <h2 className="section-title">Available rides</h2>

          {loading ? (
            <p className="subtle-text">Loading rides...</p>
          ) : rides.length === 0 ? (
            <p className="subtle-text">No rides found.</p>
          ) : (
            <div className="ride-list">
              {rides.map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default SearchRide;