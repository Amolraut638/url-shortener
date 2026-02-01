const express = require("express");
const { redirectUrl } = require("../controllers/redirect.controller");

const router = express.Router();

router.get("/:shortCode", redirectUrl);

module.exports = router;
