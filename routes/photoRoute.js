const express = require("express");
const photoController = require("./../controllers/photoController");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(photoController.getAllPhoto)
  .post(
    photoController.addPhotosToAlbum,
    photoController.resizePhotoToAlbum,
    photoController.createPhoto
  );
module.exports = router;
