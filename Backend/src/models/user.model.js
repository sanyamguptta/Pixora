// requiring mongoose for creating user schema and model
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already exits"],
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    unique: [true, "Username already exits"],
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false // used for not reading password from DB, but password will be saved in the DB
  },
  bio: String,
  profileImage: {
    type: String,
    default: "https://ik.imagekit.io/samguptta/default-img.webp",
  },
});

// creating userModel
const userModel = new mongoose.model("user", userSchema);

module.exports = userModel;
