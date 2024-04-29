const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
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
});
const photoAlbumSchema = new mongoose.Schema(
  {
    imageCover: String,
    photos: [photoSchema],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// photoAlbumSchema.virtual("photos", {
//   ref: "PhotoInAlbum",
//   localField: "_id",
//   foreignField: "album",
// });

// photoAlbumSchema.methods.addPhotos = async function (newPhoto) {
//   this.photos.push(newPhoto);
//   await this.save();
// };
photoAlbumSchema.statics.addPhotos = async function (photoAlbumId, newPhoto) {
  await PhotoAlbum.findByIdAndUpdate(
    photoAlbumId,
    {
      $push: {
        photos: newPhoto,
      },
    },
    {}
  );
};
// photoAlbumSchema.methods.deletePhotos = async function (photoId) {
//   this.photos = this.photos.filter((photo) => {
//     return photo._id !== photoId;
//   });
//   await this.save();
// };
photoAlbumSchema.statics.deletePhoto = async function (photoAlbumId, photoId) {
  console.log(photoAlbumId, photoId);
  await PhotoAlbum.findByIdAndUpdate(photoAlbumId, {
    $pull: { photos: { _id: photoId } },
  });
};
const PhotoAlbum = mongoose.model("PhotoAlbum", photoAlbumSchema);

module.exports = PhotoAlbum;
