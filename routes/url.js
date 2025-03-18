const express = require("express");

const generateNewShortURL = require('../controllers/url.js');

const router = express.Router();

router.post("/", generateNewShortURL);

module.exports = router;