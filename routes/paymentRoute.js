const express = require("express");
const paymentController = require("./../controllers/paymentController");
const router = express.Router();
router.get("/checkout", paymentController.createCheckOut);
module.exports = router;
