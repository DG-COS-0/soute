const express = require("express");
const router = express.Router({ mergeParams: true });
const requestController = require("./../controllers/requestController");
const authController = require("./../controllers/authController");
router
  .route("/")
  .get(requestController.setFamilyId, requestController.getAllRequests)
  .post(
    authController.protect,
    requestController.setFamilyId,
    requestController.setUserId,
    requestController.createRequest
  );

router.patch("/reply/:id", requestController.replyToRequests);
module.exports = router;
