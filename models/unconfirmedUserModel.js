const mongoose = require("mongoose");

const unconfirmedUserSchema = new mongoose.Schema({
  surName: {
    type: String,
    required: [true, "Veuillez spécifier le nom de profil non existant"],
  },
  sexe: {
    type: String,
    enum: ["M", "F"],
  },
  firstNames: {
    type: [String],
    required: [true, "Veuillez spécifier les noms du profil non existant"],
  },
});

const UnconfirmedUser = mongoose.model(
  "UnconfirmedUser",

  unconfirmedUserSchema
);
module.exports = UnconfirmedUser;
