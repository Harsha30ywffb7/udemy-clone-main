require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(
      "🔐 AUTHENTICATE - Token received:",
      token ? token.substring(0, 20) + "..." : "No token"
    );

    if (!token) {
      return res.status(401).json({ message: "Authentication token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ AUTHENTICATE - Token decoded successfully:", decoded);

    const user = await User.findById(decoded.userId).select("-passwordHash");
    console.log("🔍 AUTHENTICATE - User lookup for ID:", decoded.userId);
    console.log(
      "🔍 AUTHENTICATE - User found:",
      user ? `Yes (${user.email})` : "No"
    );

    if (!user) {
      console.log(
        "❌ AUTHENTICATE - User not found in database for ID:",
        decoded.userId
      );
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isActive) {
      console.log("❌ AUTHENTICATE - User account is deactivated");
      return res.status(401).json({ message: "Account is deactivated" });
    }

    console.log(
      "✅ AUTHENTICATE - User authenticated successfully:",
      user.email
    );
    req.user = user;

    next();
  } catch (error) {
    console.error("❌ AUTHENTICATE - Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authenticate };
