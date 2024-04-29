const express = require("express");
const photoAlbumController = require("./../controllers/photoAlbumController");
const photoRouter = require("./photoRoute");
const router = express.Router();

router
  .route("/")
  .get(photoAlbumController.getAllPhotoAlbums)
  .post(
    photoAlbumController.uploadCoverImage,
    photoAlbumController.resizeCoverImage,
    photoAlbumController.createPhotoAlbum
  );
router
  .route("/:id")
  .get(photoAlbumController.getPhotoAlbum)
  .patch(
    photoAlbumController.uploadCoverImage,
    photoAlbumController.resizeCoverImage,
    photoAlbumController.updatePhotoAlbum
  );
router.patch(
  "/addPhotos/:id",
  photoAlbumController.addPhotoToAlbum,
  photoAlbumController.resizePhotoToAlbum,
  photoAlbumController.registerPhoto
);
router.patch(
  "/deletePhoto/:id/photo/:photoId",
  photoAlbumController.deletePhoto
);
module.exports = router;
