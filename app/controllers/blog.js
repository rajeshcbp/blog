const utils = require("../utils");
//const Joi = require("joi");
const Joi = require("@hapi/joi");
const logger = require("../handlers/logHandlers");
const blogModel = require("../models/blogs");
const config = require("../../config");

module.exports = {
  create: async (req, res) => {
    //validation
    const schema = Joi.object().keys({
      blogTitle: Joi.string().required(),
      blogBody: Joi.string().required(),
    });

    const checkDetails = {
      blogTitle: req.body.blogTitle,
      blogBody: req.body.blogBody,
    };
    Joi.validate(checkDetails, schema, async (err, value) => {
      if (err) {
        // send a 422 error response if validation fails
        console.log("Validataion error", err.details[0].message);
        let result = {};
        result.success = false;
        let status = 422;
        result.message = err.details[0].message;
        result.data = null;
        return res.status(status).send(result);
      } else {
        let result = {};
        let status = 200;

        try {
          let query = {
            blogTitle: req.body.blogTitle,
            blogBody: req.body.blogBody,
          };
          let blogDetails = await utils.MODEL_ORM.create(
            utils.MODEL.blogs,
            query
          );

          if (blogDetails) {
            logger.info("Blog details created successfully");

            return res.status(201).json({
              success: true,
              data: {
                msg: `Success`,
                results: blogDetails,
              },
            });
          } else {
            return res.status(200).json({
              success: false,
              data: {
                msg: `Failed`,
                results: {},
              },
            });
          }
        } catch (e) {
          result.success = false;
          status = 500;
          result.status = status;
          result.message = e;
          result.data = {};
          res.status(status).send(result);
        }
      }
    });
  },
  //================Get All blogs======================================
  getAll: async (req, res) => {
    try {
      let query = {};
      let selected = " -__v";
      let populate = [];
      let sort = { created_date: -1 };
      let allBlogsDetails = await utils.MODEL_ORM.findAll(
        utils.MODEL.blogs,
        query,
        selected,
        populate,
        sort
      );

      if (allBlogsDetails.length > 0) {
        logger.info("All blogs Details found successfully");

        return res.status(200).json({
          success: true,
          data: {
            msg: `Records found`,
            results: allBlogsDetails,
          },
        });
      } else {
        return res.status(404).json({
          success: true,
          data: {
            msg: `Records not found`,
            results: [],
          },
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        data: {
          msg: e.message,
          results: null,
        },
      });
    }
  },

  //=============Get single blog info================================
  getSingle: async (req, res) => {
    try {
      let query = {
        _id: req.params.blogId,
      };

      let blogDetails = await utils.MODEL_ORM.findOne(utils.MODEL.blogs, query);

      if (blogDetails) {
        logger.info(`Blog details found`);

        return res.status(200).json({
          success: true,
          data: {
            msg: `Records found`,
            results: blogDetails,
          },
        });
      } else {
        return res.status(404).json({
          success: false,
          data: {
            msg: `Blog details not found`,
            results: {},
          },
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        data: {
          msg: e.message,
          results: null,
        },
      });
    }
  },

  //=============Update blog details================================
  update: async (req, res) => {
    try {
      let query = [
        {
          _id: req.params.blogId,
        },
        {
          $set: {
            blogTitle: req.body.blogTitle,
            blogBody: req.body.blogBody,
          },
        },
        {
          w: 1,
        },
      ];

      let blog = await utils.MODEL_ORM.findOne(utils.MODEL.blogs, {
        _id: req.params.blogId,
      });

      if (blog) {
        let blogUpdate = await utils.MODEL_ORM.update(utils.MODEL.blogs, query);

        if (blogUpdate.nModified) {
          return res.status(200).json({
            success: true,
            data: {
              msg: `Updated`,
              results: null,
            },
          });
        } else {
          return res.status(200).json({
            success: false,
            data: {
              msg: `Failed`,
              results: null,
            },
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          data: {
            msg: `Blog not found`,
            results: null,
          },
        });
      }
    } catch (e) {
      logger.error("Status error : ", e);
      return res.status(500).json({
        success: false,
        data: {
          msg: e.message,
          results: null,
        },
      });
    }
  },

  //=============Create new comment on a blog ================================
  comment: async (req, res) => {
    //validation
    const schema = Joi.object().keys({
      blogId: Joi.string().required(),
      email: Joi.string().required(),
      comment: Joi.string().required(),
    });

    const checkDetails = {
      blogId: req.params.blogId,
      email: req.body.email,
      comment: req.body.comment,
    };
    Joi.validate(checkDetails, schema, async (err, value) => {
      if (err) {
        // send a 422 error response if validation fails
        console.log("Validataion error", err.details[0].message);
        let result = {};
        result.success = false;
        let status = 422;
        result.message = err.details[0].message;
        result.data = null;
        return res.status(status).send(result);
      } else {
        try {
          const now = new Date();
          const secondsSinceEpoch = Math.round(now.getTime() / 1000);
          let query = [
            {
              _id: req.params.blogId,
            },
            {
              $addToSet: {
                commentId: secondsSinceEpoch,
                email: req.body.email,
                comment: req.body.comment,
              },
            },
            {
              w: 1,
            },
          ];

          let blog = await utils.MODEL_ORM.findOne(utils.MODEL.blogs, {
            _id: req.params.blogId,
          });

          if (blog) {
            let blogUpdate = await utils.MODEL_ORM.update(
              utils.MODEL.blogs,
              query
            );

            if (blogUpdate.nModified) {
              return res.status(200).json({
                success: true,
                data: {
                  msg: `Added`,
                  results: null,
                },
              });
            } else {
              return res.status(200).json({
                success: false,
                data: {
                  msg: `Failed`,
                  results: null,
                },
              });
            }
          } else {
            return res.status(404).json({
              success: false,
              data: {
                msg: `Blog not found`,
                results: null,
              },
            });
          }
        } catch (e) {
          logger.error("Status error : ", e);
          return res.status(500).json({
            success: false,
            data: {
              msg: e.message,
              results: null,
            },
          });
        }
      }
    });
  },

  //=============Create new reply for an comment on a blog ================================
  reply: async (req, res) => {
    //validation
    const schema = Joi.object().keys({
      blogId: Joi.string().required(),
      commentId: Joi.string().required(),
      email: Joi.string().required(),
      reply: Joi.string().required(),
    });

    const checkDetails = {
      blogId: req.params.blogId,
      commentId: req.params.commentId,
      email: req.body.email,
      reply: req.body.reply,
    };
    Joi.validate(checkDetails, schema, async (err, value) => {
      if (err) {
        // send a 422 error response if validation fails
        console.log("Validataion error", err.details[0].message);
        let result = {};
        result.success = false;
        let status = 422;
        result.message = err.details[0].message;
        result.data = null;
        return res.status(status).send(result);
      } else {
        try {
          let query = [
            {
              _id: req.params.blogId,
              commentId: req.params.commentId,
            },
            {
              $push: {
                "comments.$.replies": {
                  email: req.body.email,
                  reply: req.body.reply,
                },
              },
            },
            {
              w: 1,
            },
          ];

          let blog = await utils.MODEL_ORM.findOne(utils.MODEL.blogs, {
            _id: req.params.blogId,
          });

          if (blog) {
            let blogUpdate = await utils.MODEL_ORM.update(
              utils.MODEL.blogs,
              query
            );

            if (blogUpdate.nModified) {
              return res.status(200).json({
                success: true,
                data: {
                  msg: `Added`,
                  results: null,
                },
              });
            } else {
              return res.status(200).json({
                success: false,
                data: {
                  msg: `Failed`,
                  results: null,
                },
              });
            }
          } else {
            return res.status(404).json({
              success: false,
              data: {
                msg: `Blog not found`,
                results: null,
              },
            });
          }
        } catch (e) {
          logger.error("Status error : ", e);
          return res.status(500).json({
            success: false,
            data: {
              msg: e.message,
              results: null,
            },
          });
        }
      }
    });
  },
};
