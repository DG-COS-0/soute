const catchAsync = require("../utils/catchAsync");
const ressourceShortcut = require("./ressourceShortcut");
const Relation = require("./../models/relationModel");

exports.createNewRelation = ressourceShortcut.createOneRessource(Relation);
exports.setMemberId = catchAsync(async (req, res, next) => {
  if (!req.body.member) {
    req.body.member = req.user._id;
  }
  next();
});
