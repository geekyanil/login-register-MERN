const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// creating  user Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: [6, "Password must be at least 6 characters "],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
});

// bycrypting and hashing the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// password checking
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generating token
userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this.id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("User", userSchema);
