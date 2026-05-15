// this file is used for writing logic of all authRouters (controllers logic)

const userModel = require("../models/user.model");
// requiring bcrypt for converting password into hash
const bcrypt = require("bcryptjs");
// for creating token
const jwt = require("jsonwebtoken");

async function registerController(req, res) {
  // destructuring data received in req.body
  const { username, email, password, bio, profileImage } = req.body;

  // M1: FOR CHECKING IF USER ALREADY EXITS WITH THE EMAIL OR USERNAME
  //   // checking if user exits with EMAIL
  //   const isUserExitsbyEmail = await userModel.find({ email });
  //   if (isUserExitsbyEmail) {
  //     return res.status(409).json({
  //       message: "User already exits with this EMAIL!",
  //     });
  //   }

  //   // checking if user exits with USERNAME
  //   const isUserExitsbyUsername = await userModel.find({ username });
  //   if (isUserExitsbyUsername) {
  //     return res.status(409).json({
  //       message: "User already exits with this USERNAME!",
  //     });
  //   }

  // M2: FOR CHECKING IF USER ALREADY EXITS WITH THE EMAIL OR USERNAME
  // cheking if user exits with this email or password in DB
  const isUserAlreadyExits = await userModel.findOne({
    // this array should be of condition
    // $or -> this takes ARRAY OF CONDITIONS
    $or: [
      // condition 1
      { username },
      // condition 2
      { email },
    ],
  });
  if (isUserAlreadyExits) {
    return res.status(409).json({
      message:
        "User already exits! " +
        (isUserAlreadyExits.email === email
          ? "Email already exits"
          : "Username already exits"),
    });
  }

  // yaha agye mtlb user exits nhi krta h, so register user
  // converting password into hash using bcrypt
  const hash = await bcrypt.hash(password, 10); // 2nd para -> salt -> number of hashing(layers of hashing)

  // creating user after converting password into hash
  // this user data will be saved in the DB
  const user = await userModel.create({
    username,
    email,
    bio,
    profileImage,
    password: hash, // password will be in hash format
  });

  // creating token for the registered user
  const token = jwt.sign(
    {
      // FOR CREATING TOKEN
      // 1. user ka data hona chahiye
      // 2. data unique hona chahiye
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  ); // using JWT_SECRET for signing token with its expiry time

  // setting token in cookie
  res.cookie("token", token); // (1st para) name of cookie -> token & (2nd para) setting token in cookie

  // now, sending response after registerating user
  res.status(201).json({
    message: "User is registered successfully!",
    // NOTE: WE DO NOT SEND PASSWORD AS A RESPONSE
    user: {
      email: user.email,
      username: user.username,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

async function loginController(req, res) {
  //
  const { email, username, password } = req.body;

  const user = await userModel
    .findOne({
      $or: [{ username: username }, { email: email }],
    })
    .select("+password"); // this force our query to read password even it is can't be read as bydefault

  // agar user exist hi nhi kr rha toh return krdo
  if (!user) {
    return res.status(404).json({
      message: "User not found!",
    });
  }

  // agar yaha aagye mtlb user exits krta h
  // converting login password into hash & then, comparing it with DB registered password (data)
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Password is incorrect!",
    });
  }

  // if password is valid, while login
  // then, create token
  const token = jwt.sign(
    // unique property of user (data)
    {
      id: user._id,
      username: user.username,
    },
    // signing token using JWT_SECRET
    process.env.JWT_SECRET,
    // expiry of token
    { expiresIn: "1d" },
  );

  // setting token under cookie
  res.cookie("token", token);

  // sending response after valid login
  res.status(200).json({
    message: "User logged in successfully!",
    //sending user as response
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   sameSite: "lax",
  //   secure: false
  // });

  // res.status(200).json({
  //   message: "User logged in successfully!",
  //   user: {
  //     username: user.username,
  //     email: user.email,
  //     bio: user.bio,
  //     profileImage: user.profileImage,
  //   },
  // });
}

module.exports = {
  registerController,
  loginController,
};
