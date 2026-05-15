const express = require("express")
// requiring authController file for using controllers logic
const authController = require('../controllers/auth.controller')

const authRouter = express.Router();


// creating all authetication routes using authRouters
// API WILL BE CRAETED HERE, AND LOGIC (controllers) WILL BE CREATED IN controller file

// POST -> /api/auth/register
authRouter.post("/register", authController.registerController);

// POST -> /api/auth/login
authRouter.post('/login', authController.loginController);



module.exports = authRouter;
