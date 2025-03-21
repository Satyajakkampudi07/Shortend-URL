const express = require("express");
const Url = require('../controllers/url.js');
const {restricted_loggedInUserOnly} = require('../middleware/logger.js')
const router = express.Router();

router.post("/", restricted_loggedInUserOnly, Url.generateNewShortURL);
router.get("/:shortId", Url.redirectionShortURL);

module.exports = router;