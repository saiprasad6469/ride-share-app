import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

function Home({ setIsLoggedIn }) {
  const navigate = useNavigate();

  return (
    <>
      <Navbar setIsLoggedIn={setIsLoggedIn} />

      <div className="page page-with-bottomnav">
        <div className="container">
          <section className="hero">
            <div className="hero-card">
              <div>
                <div className="hero-badge">🚗 Smart Long Distance Carpooling</div>

                <h1>Travel Together. Save More. Fill Empty Seats Easily.</h1>

                <p>
                  ShareRide connects drivers with empty seats and passengers who
                  need urgent travel. Post rides, search trips, and enjoy a
                  safe, affordable, and modern carpool experience.
                </p>

                <div className="hero-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/search")}
                  >
                    Find a Ride
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/create-ride")}
                  >
                    Offer a Ride
                  </button>
                </div>

                <div className="hero-stats">
                  <div className="stat-box">
                    <h3>500+</h3>
                    <p>Trips shared by drivers</p>
                  </div>

                  <div className="stat-box">
                    <h3>1,000+</h3>
                    <p>Passengers connected</p>
                  </div>

                  <div className="stat-box">
                    <h3>24/7</h3>
                    <p>Easy booking support</p>
                  </div>
                </div>
              </div>

              <div className="hero-illustration">
                <div className="car-card">
                  <div className="car-header">
                    <div className="car-title">Today’s Ride</div>
                    <div className="car-badge">3 Seats Left</div>
                  </div>

                  <div className="car-route">
                    <span>Hyderabad</span>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <div className="route-dot"></div>
                      <div className="route-line"></div>
                      <div
                        className="route-dot"
                        style={{ background: "#7ed6c1" }}
                      ></div>
                    </div>

                    <span>Pune</span>
                  </div>

                  <div className="car-meta">
                    <div className="meta-chip">📅 16 March</div>
                    <div className="meta-chip">⏰ 8:00 AM</div>
                    <div className="meta-chip">💺 ₹900 / seat</div>
                    <div className="meta-chip">🚘 Tata Nexon</div>
                  </div>
                </div>

                <div className="hero-road"></div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="section-title">What would you like to do?</h2>

            <div className="home-actions">
              <div className="action-box">
                <div className="action-icon icon-blue">🔎</div>
                <h3>Search Available Rides</h3>
                <p>
                  Find rides based on source, destination, date, and available
                  seats with a smooth booking flow.
                </p>
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => navigate("/search")}
                >
                  Search Now
                </button>
              </div>

              <div className="action-box">
                <div className="action-icon icon-green">📝</div>
                <h3>Post Your Trip</h3>
                <p>
                  Going somewhere with empty seats? Publish your ride and share
                  your travel cost with passengers.
                </p>
                <button
                  className="btn btn-secondary btn-full"
                  onClick={() => navigate("/create-ride")}
                >
                  Create Trip
                </button>
              </div>

              <div className="action-box">
                <div className="action-icon icon-peach">📍</div>
                <h3>Track Active Ride</h3>
                <p>
                  View ride progress, estimated arrival time, and quick actions
                  for better safety and travel updates.
                </p>
                <button
                  className="btn btn-outline btn-full"
                  onClick={() => navigate("/track")}
                >
                  Open Tracking
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default Home;