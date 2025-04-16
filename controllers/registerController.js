const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Roles");
require("dotenv").config();

// Register Route
const handleRegister = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email }).populate({
      path: "role",
      select: "name _id", // Yalnızca name ve _id alanlarını seçiyoruz
    });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Find the role by name or use the default 'user' role
    let userRole = await Role.findOne({ name: role || "admin" });
    if (!userRole) {
      return res.status(400).json({ message: "Role not found" });
    }

    // Create a new user with the corresponding role's ObjectId
    user = new User({
      username,
      email,
      password,
      role: userRole._id,
    });

    // Save the new user to the database
    await user.save();
    console.log("User created:", user);

    // Create a JWT token
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // Respond with the token and user data
    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handleRegister,
};
