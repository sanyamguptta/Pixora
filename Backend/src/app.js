// for creating server
const express = require("express");
//
const cookieParser = require("cookie-parser");
// cors is required to accept request from cross-origin
const cors = require("cors");

const app = express();
//
const path = require('path');

// using cors as middleware
app.use(cors({
    // for backend server to set up cookies on frontend
    credentials: true,
    origin: "http://localhost:5173" // also, need to give origin path where cookies need to be set
}))

// MIDDLEWARES
app.use(express.json());  
app.use(cookieParser()); // using cookie-parser as middleware
app.use(express.urlencoded({ extended: true }));
// for making all files of public folder publically available on the internet
app.use(express.static('./public'));

// requiring allRoutes from routes folder
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.routes");

// using this prefix for all allRouters routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);



console.log(__dirname);

app.use('*name', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/public/assets/index.html"));
})

module.exports = app;
