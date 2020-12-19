const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastName: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    userInfo: {
      type: String,
      trim: true,
    },
    encryPassword: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encryPassword = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  securePassword: function (plainPass) {
    if (!plainPass) return "";
    try {
      return (hash = crypto
        .createHmac("sha256", this.salt)
        .update(plainPass)
        .digest("hex"));
    } catch (err) {
      return "";
    }
  },
  authenticate: function (plainPass) {
    return this.securePassword(plainPass) === this.encryPassword;
  },
};

module.exports = mongoose.model("User", userSchema);
