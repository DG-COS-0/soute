const multer = require("multer");
const Family = require("../models/familyModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const ressourceShortcut = require("./ressourceShortcut");
const sharp = require("sharp");
const queryOperator = require("../utils/queryOperator");
const { User } = require("../models/userModel");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new AppError("Veuillez enregistrer que des images", 400), false);
  }
};
// TODO
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadFamilyImg = upload.single("image");
exports.resizeFamilyImg = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `family-${req.body.name}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    // .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/families/${req.file.filename}`);

  req.body.image = req.file.filename;
  next();
});
// exports.getAllFamily = ressourceShortcut.getAllRessources(Family);

exports.getAllFamily = catchAsync(async (req, res, next) => {
  const resultQuery = new queryOperator(Family.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const families = await resultQuery.query;

  res.status(200).json({
    status: "success",
    results: families.length,
    totalNb: await Family.countDocuments(),
    data: {
      families,
    },
  });
});
exports.setDahId = catchAsync(async (req, res, next) => {
  if (!req.body.dah) {
    req.body.dah = req.user.id;
  }

  next();
});
exports.updateUserToDahRole = catchAsync(async (req, res, next) => {
  if (!req.user.id) {
    return next();
  }
  await User.updateRole(req.user.id, "dah");
  next();
});

exports.getOneFamily = catchAsync(async (req, res, next) => {
  const family = await Family.findById(req.params.id).populate("members");
  if (!family)
    return next(new AppError("Pas de famille trouvé avec cet identifiant"));
  res.status(200).json({
    status: "success",
    data: {
      data: family,
    },
  });
});
exports.createFamily = ressourceShortcut.createOneRessource(Family);
