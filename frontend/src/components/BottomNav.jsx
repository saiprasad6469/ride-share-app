import { Link, useLocation } from "react-router-dom";

import { AiFillHome } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { FaRoute } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

function BottomNav() {

  const location = useLocation();

  return (
    <div className="bottom-nav">

      <Link
        to="/home"
        className={`bottom-item ${
          location.pathname === "/home" ? "active" : ""
        }`}
      >
        <AiFillHome className="bottom-icon"/>
        <span>Home</span>
      </Link>

      <Link
        to="/search"
        className={`bottom-item ${
          location.pathname === "/search" ? "active" : ""
        }`}
      >
        <IoSearch className="bottom-icon"/>
        <span>Search</span>
      </Link>

      <Link
        to="/track"
        className={`bottom-item ${
          location.pathname === "/track" ? "active" : ""
        }`}
      >
        <FaRoute className="bottom-icon"/>
        <span>Trips</span>
      </Link>

      <Link
        to="/profile"
        className={`bottom-item ${
          location.pathname === "/profile" ? "active" : ""
        }`}
      >
        <FaUserCircle className="bottom-icon"/>
        <span>Profile</span>
      </Link>

    </div>
  );
}

export default BottomNav;