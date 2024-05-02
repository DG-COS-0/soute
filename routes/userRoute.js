const express = require("express");
const router = express.Router();
const requestRouter = require("./requestRoute");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
router.post("/signup", authController.signup);
router.post("/unconfirmedUser", userController.createUnconfirmedUser);
router.get("/unconfirmedUser", userController.getAllUnconfirmedUser);
router.get("/logout", authController.logout);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);

router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);
router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch(
  "/updateMe",
  userController.uploadMemberAvatar,
  userController.resizeMemberPhoto,
  userController.updateMe
);

router.delete("/deleteMe", userController.deleteMe);

router.route("/").get(userController.getAllMembers);
router.use("/:senderId/requests", requestRouter);

module.exports = router;
