const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = "bsbsfbrnsftentwnnwnwn";
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) throw new Error("User not found");

    req.user = user; // Attach full user object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

module.exports = verifyToken;
