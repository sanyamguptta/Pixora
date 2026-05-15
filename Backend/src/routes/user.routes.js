const express = require('express')
const userController = require('../controllers/user.controller');
const identifyUser = require('../middlewares/auth.middleware');

const userRouter = express.Router();


// @route POST -> api/users/follow/:userid
// @description -> follows a user
// @access       -> private
userRouter.post('/follow/:username', identifyUser, userController.followUserController);


// @route POST -> api/users/unfollow/:userid
// @description -> unfollows a user
// @access       -> private
userRouter.post('/unfollow/:username', identifyUser, userController.unfollowUserController);

// @route GET -> api/users/profile/:username
// @description -> gets user profile info with follower counts
// @access       -> private
userRouter.get('/profile/:username', identifyUser, userController.getUserProfileController);

// @route POST -> api/users/profile/bio
// @description -> updates user bio
// @access       -> private
userRouter.post('/profile/bio', identifyUser, userController.updateUserBioController);

// @route GET -> api/users/profile/:username/followers
// @description -> gets user followers list
// @access       -> private
userRouter.get('/profile/:username/followers', identifyUser, userController.getFollowersController);

// @route GET -> api/users/profile/:username/following
// @description -> gets user following list
// @access       -> private
userRouter.get('/profile/:username/following', identifyUser, userController.getFollowingController);

module.exports = userRouter;