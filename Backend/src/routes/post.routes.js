const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
// multer provide express with powers, to read files (img) coming from frontend to server
const multer = require("multer");
// memoryStorage is used for storing file for temporary purpose
const upload = multer({ storage: multer.memoryStorage() });

// requiring middleware
const identifyUser = require("../middlewares/auth.middleware");

// POST /api/post/   [protected]
// for creating post (identifying which user is requesting, is handled in controller only)
postRouter.post(
  "/",
  upload.single("img"),
  identifyUser,
  postController.createPostController,
);

// @route ->  GET -> /api/post/  [protected]
// returns all posts which are created by the user, (identifying which user is requesting, is handled in controller only)
postRouter.get("/", identifyUser, postController.getPostController);

/**  @route ->  GET -> /api/post/details/:postid
    return an detail about specific post with the id. also check whether this post belongs to the user that the requested about the post, (identifying which user is requesting, is handled in controller only)
*/
postRouter.get(
  "/details/:postId",
  identifyUser,
  postController.getPostDetailsController,
);

/** @route POST -> api/posts/likes/:postid
  @description -> likes a post with the id provided in the req.params.id, also check whether the post belongs to the user or not
  @access     -> private
*/
postRouter.post(
  "/like/:postid",
  identifyUser,
  postController.likePostController,
);

/** @route POST -> api/posts/likes/:postid
  @description -> unlike a post with the id provided in the req.params.id, also check whether the post belongs to the user or not
  @access     -> private
*/
postRouter.post(
  "/unlike/:postid",
  identifyUser,
  postController.unlikePostController,
);

/**
 * @route GET -> /api/posts/feed
 * @descrtion -> get all the osts created in the DB
 *  @access -> private
 */
postRouter.get('/feed', identifyUser, postController.getFeedController);

// Comment routes
postRouter.post('/comment/:postId', identifyUser, postController.commentController);
postRouter.get('/comment/:postId', identifyUser, postController.getCommentsController);

// Save routes
postRouter.post('/save/:postId', identifyUser, postController.savePostController);
postRouter.post('/unsave/:postId', identifyUser, postController.unsavePostController);
postRouter.get('/saved', identifyUser, postController.getSavedPostsController);

module.exports = postRouter;
