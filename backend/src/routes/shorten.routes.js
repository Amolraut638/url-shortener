const express = require("express");
const { shortenUrl } = require("../controllers/shorten.controller");

const router = express.Router();

router.post("/shorten", shortenUrl);

module.exports = router;
