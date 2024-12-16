const Model = require("../models/class.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const ModelName = "Class";
const { uploadImage } = require("../Helpers/helper_functions");


module.exports = {
  // create: async (req, res, next) => {
  //   try {
  //     const data = req.body;

  //     try {

  //       // Check if a class with the same name already exists
  //       const classExists = await Model.findOne({
  //         name: data.name,
  //         is_inactive: false,
  //       }).lean();

  //       if (classExists) {
  //         throw createError.Conflict("Class with this name already exists.");
  //       }

  //       // Add timestamps and user info if applicable
  //       data.created_at = Date.now();
  //       if (req.user) {
  //         data.created_by = req.user.id;
  //       }

  //       // Create new class
  //       const newClass = new Model(data);
  //       const result = await newClass.save();

  //       // Respond with the created class
  //       res.json(result);
  //     } catch (error) {
  //       next(error);
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // },
  create: async (req, res, next) => {
    try {
      uploadImage(req, res, async (err) => {
        if (err) {
          return res.status(501).json({ error: err.message });
        }

        const data = req.body;

        try {
          // Check if a class with the same name already exists
          const classExists = await Model.findOne({
            name: data.name,
            is_inactive: false,
          }).lean();

          if (classExists) {
            throw createError.Conflict("Class with this name already exists.");
          }

          // Add timestamps and user info if applicable
          data.created_at = Date.now();
          if (req.user) {
            data.created_by = req.user.id;
          }

          // If an image is uploaded, save the image path
          if (req.file) {
            data.image = req.file.path;
          }

          // Create the new class
          const newClass = new Model(data);
          const result = await newClass.save();

          // Respond with the created class
          res.json(result);
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error); // Catch any unforeseen errors
    }
  },

  get: async (req, res, next) => {
   try {
    const { id } = req.params;

    // Check if the provided ID is valid
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw createError.BadRequest('Invalid Parameters');
    }

    // Find class by ID
    const result = await Model.findOne({ _id: mongoose.Types.ObjectId(id) });

    // If class not found, throw an error
    if (!result) {
      throw createError.NotFound('No Class Found');
    }

    // Return the class data
    res.json(result);
  } catch (error) {
    next(error);
  }
},


list: async (req, res, next) => {
  try {
    const {
      name,
      description,
      disabled,
      is_inactive,
      page,
      limit,
      order_by,
      order_in,
    } = req.query;

    // Ensure that page and limit are valid numbers, or set defaults
    const _page = !isNaN(parseInt(page)) && parseInt(page) > 0 ? parseInt(page) : 1;
    const _limit = !isNaN(parseInt(limit)) && parseInt(limit) > 0 ? parseInt(limit) : 20;
    const _skip = (_page - 1) * _limit;

    // Sorting setup
    let sorting = {};
    if (order_by) {
      sorting[order_by] = order_in === 'desc' ? -1 : 1;
    } else {
      sorting["_id"] = -1;
    }

    // Query setup
    const query = {};
    if (name) {
      query.name = new RegExp(name, "i");
    }
    if (description) {
      query.description = new RegExp(description, "i");
    }
    if (disabled) {
      query.disabled = disabled === "true";
    }
    if (is_inactive) {
      query.is_inactive = is_inactive === "true";
    }

    // Execute the query with pagination and sorting
    const result = await Model.aggregate([
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

    // Count total documents
    const resultCount = await Model.countDocuments(query);

    // Respond with data and meta for pagination
    res.json({
      data: result,
      meta: {
        current_page: _page,
        from: _skip + 1,
        last_page: Math.ceil(resultCount / _limit),
        per_page: _limit,
        to: Math.min(_skip + _limit, resultCount), // Ensure 'to' is not greater than total
        total: resultCount,
      },
    });
  } catch (error) {
    next(error);
  }
},


update: async (req, res, next) => {
  try {
    uploadImage(req, res, async (err) => {
      if (err) {
        return res.status(501).json({ error: err.message });
      }

      const data = req.body;
      const classId = req.params.id; // Assuming you're passing the ID via URL params

      try {
        // Find the existing class by ID
        const existingClass = await Model.findById(classId);

        if (!existingClass) {
          throw createError.NotFound("Class not found.");
        }

        // Check if the class name already exists (and belongs to a different class)
        const classExists = await Model.findOne({
          name: data.name,
          is_inactive: false,
          _id: { $ne: classId }, // Exclude the current class being updated
        }).lean();

        if (classExists) {
          throw createError.Conflict("Class with this name already exists.");
        }

        // Update timestamps and user info if applicable
        data.updated_at = Date.now();
        if (req.user) {
          data.updated_by = req.user.id;
        }

        // If a new image is uploaded, update the image path
        // Otherwise, retain the existing image path
        if (req.file) {
          data.image = req.file.path;
        } else {
          data.image = existingClass.image; // Retain the existing image if no new image is uploaded
        }

        // Update the class details
        const updatedClass = await Model.findByIdAndUpdate(classId, data, { new: true });

        // Respond with the updated class
        res.json(updatedClass);
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error); // Catch any unforeseen errors
  }
},

  delete: async (req, res, next) => {
    try {
      const { id } = req.params; // Get the class ID from the request parameters
      if (!id) {
        throw createError.BadRequest("Invalid Parameters");
      }
      const deleted_at = Date.now(); // Record the deletion time

      // Update the class entry to mark it as inactive
      const result = await Model.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: {disabled:true, is_inactive: true, deleted_at } }
      );

      // If no records were modified, the ID may not exist
      if (result.nModified === 0) {
        throw createError.NotFound("Class not found");
      }

      res.json({ message: "Class deleted successfully", result });
    } catch (error) {
      next(error);
    }
  }

};
