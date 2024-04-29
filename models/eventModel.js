const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, `Le nom d'un evenement doit etre unique`],
    required: [true, "Un Evenement doit avoir un nom"],
  },
  description: {
    type: String,
    required: [true, "Un album photo doit avoir une description"],
  },
  albumPhoto: {
    type: mongoose.Schema.ObjectId,
    ref: "PhotoAlbum",
  },
  eventDate: {
    type: Date,
    required: [true, "Veuillez ajouter une date a votre evenement"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
