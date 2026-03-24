import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    bio: "",
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({
        name: res.data.user.name || "",
        phone: res.data.user.phone || "",
        city: res.data.user.city || "",
        bio: res.data.user.bio || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page page-with-bottomnav">
        <div className="container">
          <h2 className="section-title">Edit Profile</h2>

          <div className="form-card">
            <div className="input-group">
              <label className="label">Name</label>
              <input className="input" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="label">Phone</label>
              <input className="input" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="label">City</label>
              <input className="input" name="city" value={formData.city} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="label">Bio</label>
              <textarea className="textarea" name="bio" value={formData.bio} onChange={handleChange} />
            </div>

            <button className="btn btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

export default EditProfile;