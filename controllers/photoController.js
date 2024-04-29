const sharp = require("sharp");
const { PhotoInAlbum } = require("../models/photoModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const ressourceShortcut = require("./ressourceShortcut");
const multer = require("multer");
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new AppError("Veuillez enregistrer que des images", 400), false);
  }
};
upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.addPhotosToAlbum = upload.single("photo");
exports.resizePhotoToAlbum = catchAsync(async (req, res, next) => {
  if (!req.file)
    return next(new AppError("Veuillez ajouté une photo a l'album"));

  req.file.filename = `photo-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/albums/${req.file.filename}`);
  next();
});

exports.createPhoto = catchAsync(async (req, res, next) => {
  const newPhoto = await PhotoInAlbum.create({
    ...req.body,
    album: req.params.photoAlbumId,
    path: `/public/albums/${req.file.filename}`,
  });
  res.status(201).json({
    status: "success",
    data: {
      photo: newPhoto,
    },
  });
});
exports.getAllPhoto = ressourceShortcut.getAllRessources(PhotoInAlbum);
exports.getPhoto = ressourceShortcut.getOneRessource(PhotoInAlbum);
exports.deletePhoto = ressourceShortcut.deleteOneRessource(PhotoInAlbum);
