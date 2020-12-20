const blog = require("./blog");

module.exports = (router) => {
  blog(router);
  return router;
};
