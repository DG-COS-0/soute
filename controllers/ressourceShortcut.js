const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const queryOperator = require("../utils/queryOperator");

exports.deleteOneRessource = (Ressource) =>
  catchAsync(async (req, res, next) => {
    const doc = await Ressource.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("Pas de ressource trouvé avec de id", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOneRessource = (Ressource) =>
  catchAsync(async (req, res, next) => {
    const doc = await Ressource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("Pas de ressource trouvé avec de id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOneRessource = (Ressource) =>
  catchAsync(async (req, res, next) => {
    const doc = await Ressource.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOneRessource = (Ressource, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Ressource.findById(req.params.id);
    console.log(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError("Pas de ressource trouvé avec de id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAllRessources = (Ressource, popOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.familyId) filter = { family: req.params.familyId };
    if (req.params.photoAlbumId) filter = { album: req.params.photoAlbumId };
    if (req.params.senderId)
      filter = {
        sender: req.params.senderId,
      };
    let query = Ressource.find(filter);

    if (popOptions) query = query.populate(popOptions);

    const features = new queryOperator(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      nbTotal: await Ressource.countDocuments(),
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
