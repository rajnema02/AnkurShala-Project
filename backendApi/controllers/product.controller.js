const Model = require("../models/product.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const ModelName = "Product";
const {
  uploadImage,
  uploadVendorData,
} = require("./../Helpers/helper_functions");

module.exports = {
  create: async (req, res, next) => {
    try {
      uploadImage(req, res, async (err) => {
        if (err) {
          return res.status(501).json({ error: err });
        }
        if (req.file) {
          req.body.main_image = req.file.path;
        }
        const data = req.body;
        try {
          data.created_at = Date.now();
          if (req.user) {
            data.created_by = req.user.id;
          }
          const newData = new Model(data);
          const result = await newData.save();
          res.json(newData);
          return;
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw createError.BadRequest("Invalid Parameters");
      }
      const result = await Model.findOne({ _id: mongoose.Types.ObjectId(id) });
      if (!result) {
        throw createError.NotFound(`No ${ModelName} Found`);
      }
      delete result._doc.password;
      res.json(result);
      return;
    } catch (error) {
      next(error);
    }
  },

  list: async (req, res, next) => {
    try {
      const {
        title,
        disabled,
        is_inactive,
        page,
        limit,
        order_by,
        order_in,
      } = req.query;
      const _page = page ? parseInt(page) : 1;
      const _limit = limit ? parseInt(limit) : 20;
      const _skip = (_page - 1) * _limit;
      let sorting = {};
      if (order_by) {
        sorting[order_by] = order_in == "desc" ? -1 : 1;
      } else {
        sorting["_id"] = -1;
      }
      const query = {};
      if (title) {
        query.title = new RegExp(title, "i");
      }
      // query.disabled = disabled && disabled == "true" ? true : false;
      // query.is_inactive = is_inactive && is_inactive == "true" ? true : false;
      // console.log(query);
      let result = await Model.aggregate([
        {
          $match: query,
        },
        {
          $sort: sorting,
        },
        {
          $skip: _skip,
        },
        {
          $limit: _limit,
        },
      ]);
      const resultCount = await Model.countDocuments(query);
      res.json({
        data: result,
        meta: {
          current_page: _page,
          from: _skip + 1,
          last_page: Math.ceil(resultCount / _limit, 10),
          per_page: _limit,
          to: _skip + _limit,
          total: resultCount,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  },
  count: async (req, res, next) => {
    try {
      const { full_name, email, mobile, role, topUser, disabled, is_inactive } =
        req.query;
      const query = {};
      if (full_name) {
        query.full_name = new RegExp(full_name, "i");
      }
      if (email) {
        query.email = new RegExp(email, "i");
      }
      if (mobile) {
        query.mobile = new RegExp(mobile, "i");
      }
      if (role) {
        query.role = role;
      }
      if (topUser) {
        query.topUser = mongoose.Types.ObjectId(topUser);
      }
      query.disabled = disabled && disabled == "true" ? true : false;
      query.is_inactive = is_inactive && is_inactive == "true" ? true : false;
      const result = await Model.countDocuments(query);
      res.json(result);
      return;
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
        try {
          const data = req.body;
          if (!id) {
            throw createError.BadRequest("Invalid Parameters");
          }
          if (!data) {
            throw createError.BadRequest("Invalid Parameters");
          }
          data.updated_at = Date.now();
          const result = await Model.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            { $set: data }
          );
          res.json(result);
          return;
        } catch (error) {
          if (error.isJoi === true) error.status = 422;
          return res.status(error.status || 500).send({
            error: {
              status: error.status || 500,
              message: error.message,
            },
          });
        }
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw createError.BadRequest("Invalid Parameters");
      }
      const deleted_at = Date.now();
      const result = await Model.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { is_inactive: true, deleted_at } }
      );
      res.json(result);
      return;
    } catch (error) {
      next(error);
    }
  },
  restore: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw createError.BadRequest("Invalid Parameters");
      }
      const dataToBeDeleted = await Model.findOne(
        { _id: mongoose.Types.ObjectId(id) },
        { email: 1, mobile: 1 }
      );
      if (!dataToBeDeleted) {
        throw createError.NotFound(`${ModelName} Not Found`);
      }
      const dataWithEmailExists = await Model.findOne({
        email: dataToBeDeleted.email,
        is_inactive: false,
      });
      if (dataWithEmailExists) {
        throw createError.Conflict(
          `${ModelName} with this email already exists`
        );
      }
      const dataWithMobileExists = await Model.findOne({
        mobile: dataToBeDeleted.mobile,
        is_inactive: false,
      });
      if (dataWithMobileExists) {
        throw createError.Conflict(
          `${ModelName} with this mobile already exists`
        );
      }
      const restored_at = Date.now();
      const result = await Model.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { is_inactive: false, restored_at } }
      );
      res.json(result);
      return;
    } catch (error) {
      next(error);
    }
  },
};
