const catchAsync = require("../utils/catchAsync");
const ressourceShortcut = require("./ressourceShortcut");
const Request = require("./../models/requestModel");
const User = require("../models/userModel");
const validator = require("validator");
const AppError = require("../utils/appError");
const Family = require("../models/familyModel");
const Relation = require("../models/relationModel");
exports.setFamilyId = catchAsync(async (req, res, next) => {
  if (!req.body.family) {
    req.body.family = req.params.familyId;
  }
  next();
});

exports.setUserId = catchAsync(async (req, res, next) => {
  if (!req.body.sender) {
    req.body.sender = req.user._id;
  }
  next();
});
exports.replyToRequests = catchAsync(async (req, res, next) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return next(new AppError("Pas de requete trouvé avec ce id"));
  }
  if (!req.body.action) {
    return next(
      new AppError(
        "Veuillez spécifier le type d'action que vous souhaité faire sur la requete. accepté ou rejeté"
      )
    );
  }
  if (req.body.action === "accept") {
    await request.confirmRequest();
  }
  if (req.body.action === "reject") {
    await request.rejectRequest();
  }
  res.status(200).json({
    status: "success",
    message: `La requete a été confirmé. Ce utilisateur fait maintenant partie de votre famille`,
  });
});

exports.getAllRequests = ressourceShortcut.getAllRessources(Request);
exports.getOneRequest = ressourceShortcut.getOneRessource(Request, {
  path: "sender",
});
exports.deleteRequest = catchAsync(async (req, res, next) => {
  const deletedRequest = await Request.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
    },
    {
      runValidators: true,
      new: true,
    }
  );
  console.log(deletedRequest);
  res.status(204).json({
    status: "success",
    message: "Requetes supprimé avec succès",
  });
});
exports.createRequest = ressourceShortcut.createOneRessource(Request);
