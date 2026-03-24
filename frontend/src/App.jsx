import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GoogleSuccess from "./pages/GoogleSuccess";

import Home from "./pages/Home";
import SearchRide from "./pages/SearchRide";
import CreateRide from "./pages/CreateRide";
import RideDetails from "./pages/RideDetails";
import TrackRide from "./pages/TrackRide";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyBookings from "./pages/MyBookings";
import MyPostedRides from "./pages/MyPostedRides";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Routes>
      {/* LOGIN PAGE */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/home" replace />
          ) : (
            <Login setIsLoggedIn={setIsLoggedIn} />
          )
        }
      />

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={
          isLoggedIn ? (
            <Navigate to="/home" replace />
          ) : (
            <Signup setIsLoggedIn={setIsLoggedIn} />
          )
        }
      />

      {/* GOOGLE LOGIN REDIRECT */}
      <Route
        path="/google-success"
        element={<GoogleSuccess setIsLoggedIn={setIsLoggedIn} />}
      />

      {/* HOME */}
      <Route
        path="/home"
        element={
          isLoggedIn ? (
            <Home setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* SEARCH RIDE */}
      <Route
        path="/search"
        element={isLoggedIn ? <SearchRide /> : <Navigate to="/" replace />}
      />

      {/* CREATE RIDE */}
      <Route
        path="/create-ride"
        element={isLoggedIn ? <CreateRide /> : <Navigate to="/" replace />}
      />

      {/* RIDE DETAILS */}
      <Route
        path="/ride/:id"
        element={isLoggedIn ? <RideDetails /> : <Navigate to="/" replace />}
      />

      {/* TRACK RIDE */}
      <Route
        path="/track"
        element={isLoggedIn ? <TrackRide /> : <Navigate to="/" replace />}
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={isLoggedIn ? <Profile /> : <Navigate to="/" replace />}
      />

      {/* MY BOOKINGS */}
      <Route
        path="/my-bookings"
        element={isLoggedIn ? <MyBookings /> : <Navigate to="/" replace />}
      />

      {/* EDIT PROFILE */}
      <Route
        path="/edit-profile"
        element={isLoggedIn ? <EditProfile /> : <Navigate to="/" replace />}
      />

      {/* FALLBACK ROUTE */}
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/home" : "/"} replace />}
      />
    </Routes>
  );
}

export default App;