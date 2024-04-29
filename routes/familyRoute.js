const express = require("express");
const familyController = require("./../controllers/familyController");
const authController = require("./../controllers/authController");
const requestRouter = require("./requestRoute");
const router = express.Router();

router
  .route("/")
  .get(familyController.getAllFamily)
  .post(
    authController.protect,
    familyController.setDahId,
    familyController.updateUserToDahRole,
    familyController.uploadFamilyImg,
    familyController.resizeFamilyImg,
    familyController.createFamily
  );
router.route("/:id").get(familyController.getOneFamily);

router.use("/:familyId/requests/", requestRouter);
module.exports = router;
