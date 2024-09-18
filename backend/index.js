require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const { router } = require("./routes/subscribe");

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "https://tech-jobs-fair-roma-2024-team3.vercel.app"] }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/auth", authRoutes);
app.use("/task", taskRoutes);
app.use("/subscribe", router);

const port = 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
module.exports = app;
