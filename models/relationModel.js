const mongoose = require("mongoose");

const relationSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Une relatione a propos d'un nouveau membre"],
    ref: "User",
  },

  childOfMr: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Veuillez spécifier votre pere dans la relation"],
  },

  childOfMme: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Veuillez spécifier votre pere dans la relation"],
  },
});

const Relation = mongoose.model("Relation", relationSchema);

relationSchema.pre("find", function (next) {
  this.populate({
    path: "childOfMr childOfMme",
  });

  next();
});

module.exports = Relation;
