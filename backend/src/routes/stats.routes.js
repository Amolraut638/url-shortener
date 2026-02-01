const express = require("express");
const { getUrlStats } = require("../controllers/stats.controller");

const router = express.Router();

router.get("/stats/:shortCode", getUrlStats);

module.exports = router;
