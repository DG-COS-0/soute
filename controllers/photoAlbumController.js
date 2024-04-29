const sharp = require("sharp");
const PhotoAlbum = require("../models/photoAlbumModel");
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
exports.getAllPhotoAlbums = ressourceShortcut.getAllRessources(PhotoAlbum);
exports.getPhotoAlbum = ressourceShortcut.getOneRessource(PhotoAlbum, {
  path: "photos",
});
exports.updatePhotoAlbum = ressourceShortcut.updateOneRessource(PhotoAlbum);
exports.createPhotoAlbum = ressourceShortcut.createOneRessource(PhotoAlbum);

exports.uploadCoverImage = upload.single("imageCover");
exports.resizeCoverImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `albumCover-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/albums/${req.file.filename}`);
  req.body.imageCover = `/public/img/albums/${req.file.filename}`;
  next();
});
exports.addPhotoToAlbum = upload.single("photo");
exports.resizePhotoToAlbum = catchAsync(async (req, res, next) => {
  if (!req.file)
    return next(new AppError("Veuillez ajouté une photo a l'album"));

  req.file.filename = `photo-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/albums/${req.file.filename}`);
});
exports.registerPhoto = catchAsync(async (req, res, next) => {
  await PhotoAlbum.addPhotos(req.params.id, {
    path: req.file.filename,
    smallDescription: req.body.smallDescription,
  });

  res.status(201).json({
    status: "success",
    message: `Une nouvelle photo a été ajouté à l'album`,
  });
});

exports.deletePhoto = catchAsync(async (req, res, next) => {
  await PhotoAlbum.deletePhoto(req.params.id, req.params.photoId);
  res.status(201).json({
    status: "success",
    message: `La photo a bien ete nettoyer de l'album`,
  });
});
exports.uploadManyPhotos = upload.fields([{ name: "photos", maxCount: 10 }]);

exports.resizeManyPhotos = catchAsync(async (req, res, next) => {
  if (!req.files.photos) return next();

  await Promise.all(
    req.files.photos.map(async (file, i) => {
      const fileName = `tour-${req.params.id}-${Data.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/albums/${fileName}`);
      req.body.photos.push(fileName);
    })
  );
  next();
});
