const jwt = require("jsonwebtoken");
const User = require("../models/User");

const Protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      res.status(401).json({ message: "No token found for this User" });
    }
  } catch (err) {
    res.status(401).json({ message: "Token failed", error: err.message });
  }
};

//middleware for Admi-only access

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "access Denied ,admin Only",
    });
  }
};

module.exports = { Protect, adminOnly };
