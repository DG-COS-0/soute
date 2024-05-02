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
  isActive: {
    type: Boolean,
    default: true,
  },
});

requestSchema.pre("save", async function (next) {
  this.sender = await User.findById(this.sender);

  next();
});
requestSchema.pre("save", async function (next) {
  await User.addRequest(this.sender, this._id);
  next();
});
requestSchema.pre(/^find/, async function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});
requestSchema.pre(/^find/, async function (next) {
  this.populate([
    {
      path: "sender",
      select: "surName firstNames photo email",
    },
    {
      path: "childOfMme",
      select: "surName firstNames photo email",
    },
    {
      path: "childOfMr",
      select: "surName firstNames photo email",
    },
    {
      path: "family",
      select: "name",
    },
  ]);
});
requestSchema.methods.confirmRequest = async function () {
  console.log(this.family);
  console.log(this.sender);
  await User.addUserToFamily(this.sender, this.family)
    .then(async () => {
      this.status = "accepted";

      this.expiredIn = undefined;

      await this.save({ validateBeforeSave: false });
      console.log(this);
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
