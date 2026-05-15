const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/likes.model");
const User = require("../models/user.model");
const commentModel = require("../models/comment.model");
const saveModel = require("../models/save.model");

const imagekit = new ImageKit({
  privateKey: process.env["IMAGEKIT_PRIVATE_KEY"],
});

/**
 * @route POST  -> /api/posts   [protected]
 * @descrption -> create apost with the content and images
 */
async function createPostController(req, res) {
  // file from the postman will be recieved at server in rew.file
  console.log(req.body, req.file);

  // this code takes the file towards the server / upload file to the imagekit
  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    // folder: "cohort-2-insta-clone-posts",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgURL: file.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });

  // res.send(file);
}

/**
 * @route GET -> /api/posts   [protected]
 * @descrption -> Gets all the posts created by the user which have requested
 */
async function getPostController(req, res) {
  let userID = req.user.id;

  // running query, for finding all post which are created by the requested user
  let post = await postModel.find({
    user: userID,
  });

  res.status(201).json({
    message: "Posts fetched successfully!",
    post,
  });
}

/**
 * @route GET  -> /api/posts/details
 * @descrption -> returns a detail about specific post with the id
 */
async function getPostDetailsController(req, res) {
  let username = req.user.username;
  let postID = req.params.postId;

  let post = await postModel.findById(postID).populate("user").lean();

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  const isLiked = await likeModel.findOne({ user: username, post: post._id });
  post.isLiked = !!isLiked;
  post.likeCount = await likeModel.countDocuments({ post: post._id });

  const isSaved = await saveModel.findOne({ user: username, post: post._id });
  post.isSaved = !!isSaved;
  post.commentCount = await commentModel.countDocuments({ post: post._id });

  return res.status(200).json({
    message: "Post fetched successfully!",
    post,
  });
}

/**
 * @route POST -> /api/posts/like/:postid
 * @descrption -> Like a post from the id provided in the req.params
 */
async function likePostController(req, res) {
  //
  const username = req.user.username;
  const postId = req.params.postid;

  // checking if post exits or not for liking it
  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found!",
    });
  }

  // creating record for post like
  const like = await likeModel.create({
    post: postId,
    user: username,
  });

  res.status(200).json({
    message: "Post liked successfully!",
    like,
  });
}
/**
 * @route POST -> /api/posts/unlike/:postid
 * @descrption -> Unlike a post from the id provided in the req.params
 */
async function unlikePostController(req, res) {
  
  const username = req.user.username;
  const postId = req.params.postid;

  // checking if post exits or not for liking it
  const isLiked = await likeModel.findOne({
    post: postId,
    user: username,
  })

  // if post is not liked by the user then return error
  if(!isLiked) {
    return res.status(400).json({
      message: 'Post is not liked by the user!',
    })
  }

  // deleting the like record from the DB
  await likeModel.findByIdAndDelete(isLiked._id);

  return res.status(200).json({
    message: 'Post unliked successfully!',
  })

}

/**
 * @route GET ->
 */
async function getFeedController(req, res) {
  const user = req.user;

  // Limit to 30 posts to ensure incredibly fast load times
  const arrOfPosts = await postModel.find().sort({_id: -1}).limit(30).populate("user").lean();
  
  const posts = await Promise.all(
    arrOfPosts.map(async (post) => {
      // Execute all 4 database queries concurrently for maximum speed
      const [isLiked, likeCount, isSaved, commentCount] = await Promise.all([
        likeModel.findOne({ user: user.username, post: post._id }),
        likeModel.countDocuments({ post: post._id }),
        saveModel.findOne({ user: user.username, post: post._id }),
        commentModel.countDocuments({ post: post._id })
      ]);

      post.isLiked = !!isLiked;
      post.likeCount = likeCount;
      post.isSaved = !!isSaved;
      post.commentCount = commentCount;

      return post;
    })
  );

  res.status(200).json({
    message: "Fetched all posts successfully!",
    posts,
  });
}

// --------------------------------
// COMMENTS
// --------------------------------
async function commentController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: "Comment text is required" });

  const post = await postModel.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comment = await commentModel.create({ text, post: postId, user: username });
  res.status(201).json({ message: "Comment added successfully", comment });
}

async function getCommentsController(req, res) {
  const postId = req.params.postId;
  const comments = await commentModel.find({ post: postId }).sort({ _id: -1 }).lean();
  
  const commentsWithUsers = await Promise.all(comments.map(async (c) => {
    const user = await User.findOne({ username: c.user }).lean();
    c.userDetails = user ? { username: user.username, profileImage: user.profileImage } : { username: c.user };
    return c;
  }));

  res.status(200).json({ message: "Comments fetched successfully", comments: commentsWithUsers });
}

// --------------------------------
// SAVES
// --------------------------------
async function savePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found!" });

  try {
    const save = await saveModel.create({ post: postId, user: username });
    res.status(200).json({ message: "Post saved successfully!", save });
  } catch(err) {
    res.status(400).json({ message: "Post already saved or error occurred" });
  }
}

async function unsavePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const isSaved = await saveModel.findOne({ post: postId, user: username });
  if(!isSaved) return res.status(400).json({ message: 'Post is not saved by the user!' });

  await saveModel.findByIdAndDelete(isSaved._id);
  return res.status(200).json({ message: 'Post unsaved successfully!' });
}

async function getSavedPostsController(req, res) {
  const username = req.user.username;
  
  const savedRecords = await saveModel.find({ user: username }).sort({ _id: -1 }).lean();
  const postIds = savedRecords.map(record => record.post);

  const arrOfPosts = await postModel.find({ _id: { $in: postIds } }).populate("user").lean();
  
  const postsMap = {};
  await Promise.all(arrOfPosts.map(async (post) => {
      const [isLiked, likeCount, commentCount] = await Promise.all([
        likeModel.findOne({ user: username, post: post._id }),
        likeModel.countDocuments({ post: post._id }),
        commentModel.countDocuments({ post: post._id })
      ]);
      post.isLiked = !!isLiked;
      post.likeCount = likeCount;
      post.isSaved = true; // inherently true
      post.commentCount = commentCount;
      postsMap[post._id.toString()] = post;
  }));

  const orderedPosts = savedRecords.map(record => postsMap[record.post.toString()]).filter(Boolean);

  res.status(200).json({ message: "Saved posts fetched successfully!", posts: orderedPosts });
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  unlikePostController,
  getFeedController,
  commentController,
  getCommentsController,
  savePostController,
  unsavePostController,
  getSavedPostsController
};
