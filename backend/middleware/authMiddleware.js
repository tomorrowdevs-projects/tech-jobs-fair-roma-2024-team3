const jwt = require("jsonwebtoken");
const User = require("../models/User");

function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, "your-secret-key");
    req.id = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

//Middleware per controllo formato email
function validateEmailMiddleware(req, res, next) {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  next();
}

// Regex per controllo formato email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
}

// Controllo email esistente
async function isExistingEmailMiddleware(req, res, next) {
  const { email } = req.body;
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: "Email already in use" });
  }
  next();
}

module.exports = {
  verifyToken,
  validateEmailMiddleware,
  isExistingEmailMiddleware,
};
