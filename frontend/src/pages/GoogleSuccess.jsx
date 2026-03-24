import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleSuccess({ setIsLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [navigate, setIsLoggedIn]);

  return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Logging you in...</h2>;
}

export default GoogleSuccess;