const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { secret } = require("../config/getJWTSecret");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const rounds = 10;
    this.password = await bcrypt.hash(this.password, rounds);
  }
});

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
    },
    secret,
    {
      expiresIn: "1d",
    }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
