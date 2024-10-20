const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username must be unique"],
      // minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username cannot be more than 20 characters long"],
      trim: true, //前後の空白無視
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      lowercase: true, //小文字変換
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profilePicture: {
      type: String,
    },
    backgroundPicture: {
      type: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: {
      type: String,
      maxlength: [250, "desc cannot be more than 250 characters long"],
    },
    challenges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge",
      },
    ],
  },
  { timestamps: true } //データ入力時の日付を自動的に記録
);

module.exports = mongoose.model("User", userSchema);
