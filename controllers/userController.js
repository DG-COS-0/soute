const { User } = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sharp = require("sharp");
const ressourceShorcut = require("./ressourceShortcut");
const multer = require("multer");
const UnconfirmedUser = require("../models/unconfirmedUserModel");

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
exports.getAllUnconfirmedUser =
  ressourceShorcut.getAllRessources(UnconfirmedUser);
exports.createUnconfirmedUser = catchAsync(async (req, res, next) => {
  const newUnconfirmedUser = await UnconfirmedUser.create({
    surName: req.body.surName,
    sexe: req.body.sexe,
    firstNames: req.body.firstNames,
  });
  res.status(201).json({
    status: "success",
    message: `Vous venez de créé un utilisateur non  confirmé`,
    data: newUnconfirmedUser,
  });
});
exports.uploadMemberAvatar = upload.single("photo");
exports.resizeMemberPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  console.log("resize photo");
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  console.log(req.params.id);
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirmation) {
    return next(
      new AppError(
        "Pour modifier votre mot de passe, veuillez utilisez la route /updateMyPassword .",
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, "surName", "firstName", "email");
  if (req.file) filteredBody.avatar = req.file.filename;
  const updatedMember = await Member.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedMember,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Member.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createMember = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Veuillez utiliser la route /signup",
  });
};

exports.getUser = ressourceShorcut.getOneRessource(User);
exports.getAllMembers = ressourceShorcut.getAllRessources(User);
exports.updateMember = ressourceShorcut.updateOneRessource(User);
exports.deleteMember = ressourceShorcut.deleteOneRessource(User);
