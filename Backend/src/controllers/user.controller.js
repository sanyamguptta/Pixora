const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const likeModel = require("../models/likes.model");
const commentModel = require("../models/comment.model");
const saveModel = require("../models/save.model");

async function followUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  // check if user is not requesting to follow itself
  if (followerUsername === followeeUsername) {
    return res.status(400).json({
      message: "You cannot follow yourself!",
    });
  }

  // checking if user exits
  const isFolloweeExists = await userModel.findOne({
    username: followeeUsername,
  });
  if (!isFolloweeExists) {
    return res.status(404).json({
      message: "user you are trying to follow does not exits",
    });
  }

  // check if the user has not requested to follow the same user again
  const isAlreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });
  if (isAlreadyFollowing) {
    return res.status(200).json({
      message: `You are already following ${followeeUsername}`,
      follow: isAlreadyFollowing,
    });
  }

  // yaha agye mltb, user already follow nhi krta toh ek new record bna do
  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
  });

  res.status(200).json({
    message: `You are now following ${followeeUsername}`,
    follow: followRecord,
  });
}

async function unfollowUserController(req, res) {

    //
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    // checking if user is already followed or not
    const isUserFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername,
    })
    // if not followed already, then return directly
    if(!isUserFollowing) {
        return res.status(200).json({
            message: `You are not following ${followeeUsername}`,
        })
    }

    // deleting record for unfollowing user
    await followModel.findByIdAndDelete(isUserFollowing._id);

    // sending response after unfollowing
    res.status(200).json({
        message: `You have successfully unfollowed ${followeeUsername}`,
    })

}

async function getUserProfileController(req, res) {
  const targetUsername = req.params.username;
  const requesterUsername = req.user.username;

  // find user
  const user = await userModel.findOne({ username: targetUsername }).lean();
  if(!user) return res.status(404).json({ message: "User not found" });

  delete user.password;

  const followersCount = await followModel.countDocuments({ followee: targetUsername });
  const followingCount = await followModel.countDocuments({ follower: targetUsername });
  const isFollowing = await followModel.findOne({ follower: requesterUsername, followee: targetUsername });

  user.followersCount = followersCount;
  user.followingCount = followingCount;
  user.isFollowing = !!isFollowing;

  const userPosts = await postModel.find({ user: user._id }).sort({ _id: -1 }).populate("user").lean();
  
  const postsWithStats = await Promise.all(userPosts.map(async (p) => {
    p.likeCount = await likeModel.countDocuments({ post: p._id });
    p.commentCount = await commentModel.countDocuments({ post: p._id });
    const isLiked = await likeModel.findOne({ user: requesterUsername, post: p._id });
    p.isLiked = !!isLiked;
    const isSaved = await saveModel.findOne({ user: requesterUsername, post: p._id });
    p.isSaved = !!isSaved;
    return p;
  }));

  res.status(200).json({
    message: "Profile fetched successfully",
    user,
    posts: postsWithStats
  });
}

async function updateUserBioController(req, res) {
  try {
    const { bio } = req.body;
    const username = req.user.username;

    if (typeof bio !== 'string') {
      return res.status(400).json({ message: "Bio must be a string." });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { username: username },
      { bio: bio },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Bio updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getFollowersController(req, res) {
  try {
    const targetUsername = req.params.username;
    // Find all follow records where followee is targetUsername
    const followRecords = await followModel.find({ followee: targetUsername }).lean();
    
    // Extract follower usernames
    const followerUsernames = followRecords.map(record => record.follower);

    // Fetch user details for these followers
    const followers = await userModel.find({ 
      username: { $in: followerUsernames } 
    }).select('username profileImage').lean();

    res.status(200).json({
      message: "Followers fetched successfully",
      followers
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getFollowingController(req, res) {
  try {
    const targetUsername = req.params.username;
    // Find all follow records where follower is targetUsername
    const followRecords = await followModel.find({ follower: targetUsername }).lean();
    
    // Extract followee usernames
    const followingUsernames = followRecords.map(record => record.followee);

    // Fetch user details for these followees
    const following = await userModel.find({ 
      username: { $in: followingUsernames } 
    }).select('username profileImage').lean();

    res.status(200).json({
      message: "Following fetched successfully",
      following
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  followUserController,
  unfollowUserController,
  getUserProfileController,
  updateUserBioController,
  getFollowersController,
  getFollowingController
};
