const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
  signupUser,
  loginUser,
  getMe,
  updateProfile,
  uploadAvatar,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.put("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/`,
  }),
  async (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(`${process.env.CLIENT_URL}/google-success?token=${token}`);
  }
);

module.exports = router;