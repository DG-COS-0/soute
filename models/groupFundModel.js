const mongoose = require("mongoose");

const groupFundSchema = new mongoose.Schema({
  for: {
    type: String,
    required: [true, "Veuillez specifier le but de la cagnotte"],
  },
  maxSize: {
    type: Number,
    required: [true, "Veuillez spécifier un montant maximale"],
  },
  isOpen: {
    type: boolean,
    default: true,
  },
});
const GroupFund = mongoose.model("GroupFund", groupFundSchema);
module.exports = GroupFund;
