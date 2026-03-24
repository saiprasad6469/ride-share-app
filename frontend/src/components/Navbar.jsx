import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }

    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="logo-box" onClick={() => handleNavigate("/home")}>
          <div className="logo-icon">🚗</div>
          <div className="logo-text">
            Share<span>Ride</span>
          </div>
        </div>

        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <button className="nav-btn" onClick={() => handleNavigate("/home")}>
            Home
          </button>

          <button className="nav-btn" onClick={() => handleNavigate("/search")}>
            Find Ride
          </button>

          <button className="nav-btn" onClick={() => handleNavigate("/create-ride")}>
            Offer Ride
          </button>

          <button className="nav-btn" onClick={() => handleNavigate("/profile")}>
            Profile
          </button>

          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;