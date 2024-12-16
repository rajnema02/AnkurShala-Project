const Model = require("../models/subject.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const ModelName = "Subject";
const { uploadImage } = require("../Helpers/helper_functions");

module.exports = {
  create: async (req, res, next) => {
    try {
      uploadImage(req, res, async (err) => {
        if (err) {
          return res.status(501).json({ error: err.message });
        }

        const data = req.body;

        try {
          const dataExists = await Model.findOne({

            is_inactive: false,
          }).lean();

          // if (dataExists) {
          //   throw createError.Conflict(`Subject already exists with this name`);
          // }

          // Add timestamps and metadata
          data.created_at = Date.now();

          if (req.user) {
            data.created_by = req.user.id;
          }

          // If image is uploaded, store the file path
          if (req.file) {
            data.image = req.file.path;
          }

          // Create new Subject
          const newSubject = new Model(data);
          const result = await newSubject.save();

          // Send the response
          res.json(result);
        } catch (error) {
          next(error); // Forward error to error handling middleware
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
        throw createError.BadRequest("Invalid Parameters");
      }

      // Find subject by ID
      const result = await Model.findOne({ _id: mongoose.Types.ObjectId(id) });

      // If subject not found, throw an error
      if (!result) {
        throw createError.NotFound("No Subject Found");
      }

      // Return the subject data
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
  list: async (req, res, next) => {
    try {
      const { name, disabled, is_inactive, page, limit, order_by, order_in } =
        req.query;

      // Pagination setup
      const _page = page ? parseInt(page) : 1;
      const _limit = limit ? parseInt(limit) : 20;
      const _skip = (_page - 1) * _limit;

      // Sorting setup
      let sorting = {};
      if (order_by) {
        sorting[order_by] = order_in === "desc" ? -1 : 1;
      } else {
        sorting["_id"] = -1;
      }

      // Query setup
      const query = {};
      if (name) {
        query.name = new RegExp(name, "i"); // Case-insensitive search for name
      }
      query.disabled = disabled === "true" ? true : false;
      query.is_inactive = is_inactive === "true" ? true : false;

      // Fetch subjects with aggregation pipeline
      const result = await Model.aggregate([
        { $match: query },
        { $sort: sorting },
        { $skip: _skip },
        { $limit: _limit },
        {
          $lookup: {
            from: "classes",
            localField: "class",
            foreignField: "_id",
            as: "classDetails",
          },
        },
        { $unwind: "$classDetails" },
      ]);

      // Count total results
      const resultCount = await Model.countDocuments(query);

      // Respond with the data and pagination info
      res.json({
        data: result,
        meta: {
          current_page: _page,
          from: _skip + 1,
          last_page: Math.ceil(resultCount / _limit),
          per_page: _limit,
          to: _skip + _limit,
          total: resultCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // update: async (req, res, next) => {
  //   try {
  //     const { id } = req.params;

  //     // Check if the provided ID is valid
  //     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
  //       throw createError.BadRequest("Invalid Parameters");
  //     }

  //     // Prepare the update data
  //     const data = req.body;

  //     if (!data && !req.file) {
  //       throw createError.BadRequest("No data provided for update");
  //     }

  //     if (req.file) {
  //       data.image = req.file.path; // Assuming `image` is the field for the uploaded image
  //     }

  //     if (req.user) {
  //       data.updated_by = req.user.id;
  //     }
  //     data.updated_at = Date.now();

  //     const result = await Model.findByIdAndUpdate(
  //       { _id: mongoose.Types.ObjectId(id) },
  //       { $set: data },
  //       { new: true }
  //     );

  //     if (!result) {
  //       throw createError.NotFound("entity not found");
  //     }

  //     // Respond with the updated "about" entity
  //     res.json(result);
  //   } catch (error) {
  //     if (error.isJoi === true) error.status = 422;
  //     return res.status(error.status || 500).send({
  //       error: {
  //         status: error.status || 500,
  //         message: error.message,
  //       },
  //     });
  //   }
  // },
  update: async (req, res, next) => {
    try {
        uploadImage(req, res, async (err) => {
            if (err) {
                return res.status(501).json({ error: err.message });
            }

            const data = req.body;
            const id = req.params.id; // Assuming you're passing the ID via URL params

            try {
                // Check if the provided ID is valid
                if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                    throw createError.BadRequest("Invalid Parameters");
                }

                // Find the existing entity by ID
                const existingEntity = await Model.findById(id);
                if (!existingEntity) {
                    throw createError.NotFound("Entity not found.");
                }

                // Check if the entity name already exists (and belongs to a different entity)
                const entityExists = await Model.findOne({
                    name: data.name,
                    is_inactive: false,
                    _id: { $ne: id }, // Exclude the current entity being updated
                }).lean();

                if (entityExists) {
                    throw createError.Conflict("Entity with this name already exists.");
                }

                // Update timestamps and user info if applicable
                data.updated_at = Date.now();
                if (req.user) {
                    data.updated_by = req.user.id;
                }

                // If a new image is uploaded, update the image path
                // Otherwise, retain the existing image path
                if (req.file) {
                    data.image = req.file.path; // Assuming `image` is the field for the uploaded image
                } else {
                    data.image = existingEntity.image; // Retain the existing image if no new image is uploaded
                }

                // Update the entity details
                const updatedEntity = await Model.findByIdAndUpdate(id, { $set: data }, { new: true });

                // Respond with the updated entity
                res.json(updatedEntity);
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
      const { id } = req.params;

      // Check if the provided ID is valid
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw createError.BadRequest("Invalid Parameters");
      }

      // Add the current timestamp for deletion
      const deleted_at = Date.now();

      // Update the subject to mark it as inactive (soft delete)
      const result = await Model.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { is_inactive: true, deleted_at } }
      );

      // If the subject was not found, return an error
      if (result.nModified === 0) {
        throw createError.NotFound("Subject not found");
      }

      // Respond with the result of the deletion
      res.json({ message: "Subject marked as inactive", result });
    } catch (error) {
      next(error);
    }
  },
  // getByClass: async function (req, res) {
  //   const { id } = req.params;
  //   console.log(id)
  //   const { page, limit, order_by, order_in } = req.query;

  //   const _page = page ? parseInt(page) : 1;
  //   const _limit = limit ? parseInt(limit) : 10;
  //   const _skip = (_page - 1) * _limit;

  //   try {
  //     // Define sorting logic
  //     let sorting = {};
  //     if (order_by) {
  //       sorting[order_by] = order_in === "desc" ? -1 : 1;
  //     } else {
  //       sorting["_id"] = -1; // Default sorting by _id (descending)
  //     }

  //     // Ensure id is a valid ObjectId
  //     const classId = mongoose.Types.ObjectId.isValid(id) ? mongoose.Types.ObjectId(id) : null;
  //     if (!classId) {
  //       return res.status(400).json({ message: "Invalid class ID format" });
  //     }

  //     // Aggregation pipeline to filter by class and disabled fields
  //     const query = {
  //       class: classId,
  //       disabled: false,
  //     };

  //     console.log("Query:", query); // Log the query for debugging

  //     let result = await Model.aggregate([
  //       { $match: query }, // Match the query for class and disabled fields
  //       { $sort: sorting }, // Apply sorting
  //       { $skip: _skip }, // Pagination: Skip results based on page
  //       { $limit: _limit }, // Limit results per page
  //       {
  //         $lookup: {
  //           from: "classes", // Ensure "classes" is the correct collection name
  //           localField: "class",
  //           foreignField: "_id",
  //           as: "classDetails",
  //         },
  //       },
  //       { $unwind: "$classDetails" }, // Unwind the classDetails array
  //     ]);

  //     console.log("Result:", result); // Log the result to check if anything is returned

  //     // Count total number of results for pagination metadata
  //     const resultCount = await Model.countDocuments(query);
  //     console.log("Result Count:", resultCount); // Log the count

  //     // Respond with data and pagination metadata
  //     res.json({
  //       data: result,
  //       meta: {
  //         current_page: _page,
  //         from: _skip + 1,
  //         last_page: Math.ceil(resultCount / _limit),
  //         per_page: _limit,
  //         to: _skip + result.length,
  //         total: resultCount,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error retrieving data:", error);
  //     res.status(500).json({ message: "Failed to retrieve subjects", error });
  //   }
  // }
  getByClass: async function (req, res) {
    const { id } = req.params;
    console.log(id);
    const { page, limit, order_by, order_in } = req.query;

    const _page = page ? parseInt(page) : 1;
    const _limit = limit ? parseInt(limit) : 10;
    const _skip = (_page - 1) * _limit;

    try {
      // Define sorting logic
      let sorting = {};
      if (order_by) {
        sorting[order_by] = order_in === "desc" ? -1 : 1;
      } else {
        sorting["_id"] = -1; // Default sorting by _id (descending)
      }

      // Ensure id is a valid ObjectId
      const classId = mongoose.Types.ObjectId.isValid(id) ? mongoose.Types.ObjectId(id) : null;
      if (!classId) {
        return res.status(400).json({ message: "Invalid class ID format" });
      }

      // Aggregation pipeline to filter subjects by class ID
      const query = {
        class: classId, // Match the class ID
        disabled: false, // Only fetch subjects that are not disabled
      };

      console.log("Query:", query); // Log the query for debugging

      let result = await Model.aggregate([
        { $match: query }, // Match the query for class and disabled fields
        { $sort: sorting }, // Apply sorting
        { $skip: _skip }, // Pagination: Skip results based on page
        { $limit: _limit }, // Limit results per page
        {
          $lookup: {
            from: "classes", // Ensure "classes" is the correct collection name
            localField: "class",
            foreignField: "_id",
            as: "classDetails",
          },
        },
        { $unwind: "$classDetails" }, // Unwind the classDetails array
      ]);

      console.log("Result:", result); // Log the result to check if anything is returned

      // Count total number of results for pagination metadata
      const resultCount = await Model.countDocuments(query);
      console.log("Result Count:", resultCount); // Log the count

      // Respond with data and pagination metadata
      res.json({
        data: result,
        meta: {
          current_page: _page,
          from: _skip + 1,
          last_page: Math.ceil(resultCount / _limit),
          per_page: _limit,
          to: _skip + result.length,
          total: resultCount,
        },
      });
    } catch (error) {
      console.error("Error retrieving data:", error);
      res.status(500).json({ message: "Failed to retrieve subjects", error });
    }
  },

//   classlistForTeacher: async (req, res, next) => {
//     try {
//         const { name, disabled, is_inactive, page, limit, order_by, order_in } = req.query;

//         // Pagination setup
//         const _page = page ? parseInt(page) : 1;
//         const _limit = limit ? parseInt(limit) : 20;
//         const _skip = (_page - 1) * _limit;

//         // Sorting setup
//         let sorting = {};
//         if (order_by) {
//             sorting[order_by] = order_in === "desc" ? -1 : 1;
//         } else {
//             sorting["_id"] = -1;
//         }

//         // Query setup
//         const query = {};
//         if (name) {
//             query.name = new RegExp(name, "i"); // Case-insensitive search for name
//         }
//         query.disabled = disabled === "true";
//         query.is_inactive = is_inactive === "true";

//         // Fetch classes and subjects with aggregation pipeline
//         const result = await Model.aggregate([
//             { $match: query },
//             { $sort: sorting },
//             { $skip: _skip },
//             { $limit: _limit },
//             {
//                 $lookup: {
//                     from: "classes",
//                     localField: "class",
//                     foreignField: "_id",
//                     as: "classDetails",
//                 },
//             },
//             { $unwind: "$classDetails" },
//             {
//                 $group: {
//                     _id: {
//                         id: "$classDetails._id",
//                         name: "$classDetails.name",
//                         description: "$classDetails.description"
//                     },
//                     subjects: { $push: "$name" },
//                 },
//             },
//             {
//                 $project: {
//                     _id: "$_id.id",
//                     name: "$_id.name",
//                     subjects: "$subjects",
//                     description: "$_id.description",
//                 },
//             },
//         ]);

//         // Count total results
//         const resultCount = await Model.countDocuments(query);

//         // Respond with the data and pagination info
//         res.json({
//             data: result,
//             meta: {
//                 current_page: _page,
//                 from: _skip + 1,
//                 last_page: Math.ceil(resultCount / _limit),
//                 per_page: _limit,
//                 to: _skip + _limit,
//                 total: resultCount,
//             },
//         });
//     } catch (error) {
//         next(error);
//     }
// }
// Pagination setup

classlistForTeacher: async (req, res, next) => {
  try {
    const { name, disabled, is_inactive, page, limit, order_by, order_in, classId } = req.query;

    // Pagination setup
    const _page = page ? parseInt(page) : 1;
    const _limit = limit ? parseInt(limit) : 20;
    const _skip = (_page - 1) * _limit;

    // Sorting setup
    let sorting = {};
    if (order_by) {
      sorting[order_by] = order_in === "desc" ? -1 : 1;
    } else {
      sorting["_id"] = -1;
    }

    // Query setup
    const query = {};
    if (name) {
      query.name = new RegExp(name, "i"); // Case-insensitive search for name
    }
    query.disabled = disabled === "true" ? true : false;
    query.is_inactive = is_inactive === "true" ? true : false;

    // Fetch subjects with aggregation pipeline
    const result = await Model.aggregate([
      { $match: query },
      { $sort: sorting },
      { $skip: _skip },
      { $limit: _limit },
      {
        $lookup: {
          from: "classes",
          localField: "class",
          foreignField: "_id",
          as: "classDetails",
        },
      },
      { $unwind: "$classDetails" },
      {
        $lookup: {
          from: "subjects",  // Assuming "subjects" is the collection name
          localField: "classDetails._id",  // Match the class ID
          foreignField: "class",  // Assuming subjects have classId field
          as: "subjectDetails",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          disabled: 1,
          is_inactive: 1,
          classDetails: 1,
          subjectDetails: 1, // Include subjectDetails in the output
        },
      },
    ]);

    // Count total results
    const resultCount = await Model.countDocuments(query);

    // Respond with the data and pagination info
    res.json({
      data: result,
      meta: {
        current_page: _page,
        from: _skip + 1,
        last_page: Math.ceil(resultCount / _limit),
        per_page: _limit,
        to: _skip + _limit,
        total: resultCount,
      },
    });
  } catch (error) {
    next(error);
  }
},
}
