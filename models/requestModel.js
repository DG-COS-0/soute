const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const { User } = require("./userModel");

const requestSchema = new mongoose.Schema({
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
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Veuillez spécifier le requeteur"],
  },
  senderMessage: {
    type: String,
    required: [true, "La request doit avoir un message"],
  },
  returnMessage: {
    type: String,
  },
  family: {
    type: mongoose.Schema.ObjectId,
    ref: "Family",
    required: [true, "La request doit etre pour rejoindre une famille"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiredIn: {
    type: Date,
    default: Date.now() + 1000 * 60 * 60 * 24 * 10,
  },
  status: {
    type: String,
    default: "unconfirmed",
    enum: {
      values: ["unconfirmed", "accepted", "rejected"],
      messages: "Votre status de requete n'est pas pris en compte",
    },
  },
});

requestSchema.pre("save", async function (next) {
  this.sender = await User.findById(this.sender);
  next();
});
requestSchema.methods.confirmRequest = async function () {
  console.log(this.family);
  console.log(this.sender);
  await User.addUserToFamily(this.sender, this.family)
    .then(async () => {
      this.status = "accepted";

      this.expiredIn = undefined;

      await this.save({ validateBeforeSave: false });
    })
    .catch((err) => {
      console.log(err);
    });
};

requestSchema.methods.rejectRequest = async function () {
  this.status = "rejected";
  this.expiredIn = undefined;
  await this.save({ validateBeforeSave: false });
};

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
