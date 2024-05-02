const mongoose = require("mongoose");

const familySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Veuillez ajouter une description a votre  famille"],
    },
    name: {
      type: String,
      unique: true,
      required: [true, "Veuillez spécifier le nom de votre famille"],
    },

    dah: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Veuillez specifier un chef de famille"],
      },
    ],
    image: {
      type: String,
      required: [true, "Veuillez spécifier une image pour la famille"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

familySchema.virtual("members", {
  ref: "User",
  foreignField: "family",
  localField: "_id",
});
familySchema.methods.inviteNewMember = function (email) {
  const invitationToken = crypto.randomBytes(32).toString("hex");
};
const Family = mongoose.model("Family", familySchema);

module.exports = Family;
