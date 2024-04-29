const mongoose = require("mongoose");

photoSchema = new mongoose.Schema({
  path: {
    type: String,
    required: [true, "veuillez specifier le chemin de la photo"],
  },
  smallDescription: {
    type: String,
    required: [true, "Veuillez entré une petite description de la photo"],
    maxLength: [
      200,
      "La description de la photo ne doit pas depassé 200 caractères",
    ],
  },
  album: {
    type: mongoose.Schema.ObjectId,
    ref: "PhotoAlbum",
  },
});

const Photo = mongoose.model("Photo", photoSchema);
module.exports = Photo;
