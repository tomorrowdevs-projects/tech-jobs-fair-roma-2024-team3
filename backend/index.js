require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const webpush = require("web-push");

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "https://tech-jobs-fair-roma-2024-team3.vercel.app"] }));
app.use(express.json());

// VapidKey utilizzate per servizio notifiche
const publicVapidKey = "BBP1CWqLkQR0P76G_pBMD0ah5jQLuKy9mZHjMQ3RTUKRL5x2LSbUilUZd5hPD5sPUBCRvT--2r5aXoHVxUIICRM";
const privateVapidKey = "JZ8KJ1w3AVfHfLEdcwJQtS2nfehLeUaRv6l8LUyTcc0";

// Setup delle key alla libreria webpush
webpush.setVapidDetails("mailto:pirot55033@ofionk.com", publicVapidKey, privateVapidKey);

// Array contenente sottoscrizioni ricevute
let subscriptions = [];

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/auth", authRoutes);
app.use("/task", taskRoutes);

// Endpoint per iscrizione alle notifiche
app.post("/subscribe", (req, res) => {
  subscriptions.push(req.body);
  res.status(201).json({});
  const payload = JSON.stringify({ title: "Habits tracker", body: "La tua prima notifica" });

  subscriptions.forEach((subscription) => {
    webpush.sendNotification(subscription, payload).catch(console.log);
  });
});

const port = 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
module.exports = app;
