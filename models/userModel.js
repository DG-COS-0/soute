const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  surName: {
    type: String,
  },
  firstNames: {
    type: String,
  },
  sexe: {
    type: String,
    enum: {
      values: ["M", "F"],
      message: "Veuillez utilisé l'une des possibilités M ou F",
    },
    required: [true, "Veuillez entrer votres sexes"],
  },
  families: {
    type: [mongoose.Schema.ObjectId],
  },
  photo: {
    type: String,
    default: "default-user.jpg",
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "member", "dah", "admin"],
      message: `Votre role n'est pas spécifié`,
    },
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} n'est pas une addresse mail valide`,
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Veuillez entrer votre mot de passe "],
    select: false,
  },
  passwordConfirmation: {
    type: String,
    required: [true, "Veuillez confirmer votre mot de passe "],
    validate: {
      validator: function (passwordConfirmation) {
        return this.password === passwordConfirmation;
      },
      message: `Les mots de passe que vous avez entré ne correspondent pas`,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  fatherFamilyPath: {
    type: String,
  },
  motherFamilyPath: {
    type: String,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 14);
  this.passwordConfirmation = undefined;
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.statics.addUserToFamily = async function (userId, familyId) {
  await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { families: familyId },
    },
    {
      runValidators: true,
    }
  );
};
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
userSchema.statics.updateRole = async function (userId, role) {
  await User.findByIdAndUpdate(userId, { role }, { runValidators: true });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
