// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateEmailMiddleware, isExistingEmailMiddleware } = require("../middleware/authMiddleware");

// User registration
router.post("/signup", validateEmailMiddleware, isExistingEmailMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign({ userId: user._id }, "hackathon-rome-2024", {
      expiresIn: "1h",
    });
    res.status(200).json({ id: user._id, name: user.name, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
