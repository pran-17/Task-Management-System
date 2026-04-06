const jwt = require("jsonwebtoken");
const User = require("../models/User");

function getTokenFromHeader(req) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

async function protect(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_change_me");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Not authorized" });

    req.user = user;
    return next();
  } catch (_err) {
    return res.status(401).json({ message: "Not authorized" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });
    return next();
  };
}

module.exports = { protect, requireRole };

