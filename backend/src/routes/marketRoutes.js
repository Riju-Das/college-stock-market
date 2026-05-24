const express = require("express");
const marketController = require("../controllers/marketController");

const router = express.Router();

router.get("/analysis", marketController.getAnalysis);

module.exports = router;
