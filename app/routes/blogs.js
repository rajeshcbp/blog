const blogController = require("../controllers/blog");

module.exports = (router) => {
  //Craete new blog
  router.route("/blogs/create").post(blogController.create);

  //Get all blogs
  router.route("/blogs").get(blogController.getAll);

  //Get single blog
  router.route("/blogs/:blogId").get(blogController.getSingle);

  //Update blog
  router.route("/blogs/:blogId").patch(blogController.update);

  //Craete new comment
  router.route("/blogs/comment/:blogId").patch(blogController.comment);

  //Craete new reply to comment
  router
    .route("/blogs/:blogId/comment/:commentId/reply")
    .patch(blogController.reply);

  //==================================================================================
};
