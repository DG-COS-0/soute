const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  groupFund: {
    type: mongoose.Schema.ObjectId,
    ref: "GroupFund",
    required: [true, "Un payment doit etre pour une cagnotte"],
  },

  member: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "un payment doit etre effectué par un utilisateur"],
  },
  price: {
    type: Number,
    require: [true, "Un payment doit avoir un prix."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});
paymentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "member",
    select: "surName firstNames ",
  });
  next();
});
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
