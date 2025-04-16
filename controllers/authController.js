const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt with email:", email);

  try {
    const user = await User.findOne({ email }).populate({
      path: "role",
      select: "name _id", // Yalnızca name ve _id alanlarını seçiyoruz
    });
    console.log("Found user:", user);

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Şifreyi karşılaştır
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Token oluştur
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Çerezi HTTP Only olarak ayarla
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 gün
    });

    console.log("Login successful for user:", email);
    res.status(200).json({ user,token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateRole = async (req, res) => {
  const { role } = req.body;
  

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role; // Update the role
    await user.save();
    
    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  handleLogin,updateRole
};
