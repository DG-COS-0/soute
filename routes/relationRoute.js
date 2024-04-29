const express = require("express");
const relationController = require("./../controllers/relationController");
const authController = require("./../controllers/authController");
const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    relationController.setMemberId,
    relationController.createNewRelation
  );
module.exports = router;
