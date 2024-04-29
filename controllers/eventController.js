const Event = require("../models/eventModel");
const ressourceShortcut = require("./ressourceShortcut");

exports.getAllEvents = ressourceShortcut.getAllRessources(Event);
exports.getEvent = ressourceShortcut.getOneRessource(Event);
exports.deleteEvent = ressourceShortcut.deleteOneRessource(Event);
exports.updateEvent = ressourceShortcut.updateOneRessource(Event);
exports.createEvent = ressourceShortcut.createOneRessource(Event);
