// routes/task.js
const express = require("express");
const router = express.Router();
const webpush = require("web-push");

// VapidKey utilizzate per servizio notifiche
const publicVapidKey = "BBP1CWqLkQR0P76G_pBMD0ah5jQLuKy9mZHjMQ3RTUKRL5x2LSbUilUZd5hPD5sPUBCRvT--2r5aXoHVxUIICRM";
const privateVapidKey = "JZ8KJ1w3AVfHfLEdcwJQtS2nfehLeUaRv6l8LUyTcc0";

// Setup delle key alla libreria webpush
webpush.setVapidDetails("mailto:pirot55033@ofionk.com", publicVapidKey, privateVapidKey);

// Array contenente sottoscrizioni ricevute
let subscriptions = [];

// Endpoint per iscrizione alle notifiche
router.post("/", (req, res) => {
  subscriptions.push(req.body);
  const payload = JSON.stringify({ title: "Habits tracker", body: "La tua prima notifica" });

  subscriptions.forEach((subscription) => {
    webpush.sendNotification(subscription, payload).catch(console.log);
  });
  res.status(201).json({});
});

// Regex per controllo formato email
function sendNotification(payload) {
  subscriptions.forEach((subscription) => {
    webpush.sendNotification(subscription, payload).catch(console.log);
  });
}

module.exports = {router, sendNotification};
