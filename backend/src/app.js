const express = require("express");
const cors = require("cors");

const app = express();

const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173",          // local dev
      "https://zipurl-soiw.onrender.com" // prod frontend
    ],
  })
);

app.use(express.json());

const shortenRoutes = require("./routes/shorten.routes");
const redirectRoutes = require("./routes/redirect.routes");
const statsRoutes = require("./routes/stats.routes");

app.use("/", redirectRoutes);
app.use("/api", shortenRoutes);
app.use("/api", statsRoutes);

module.exports = app;
