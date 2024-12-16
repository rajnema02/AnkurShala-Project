const Model = require("../models/topic.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const ModelName = "Topic";
const { uploadImage } = require("../Helpers/helper_functions");

module.exports = {
 create :async (req,res,next) => {
    try {
        uploadImage(req, res, async (err) => {
            if (err) {
                return res.status(501).json({ error: err.message });
            }

            const data = req.body;

            try {
                // Check if a topic with the same name already exists
                const dataExists = await Model.findOne({
                    // name: data.name,
                    is_inactive: false,
                }).lean();

                // if (dataExists) {
                //     throw createError.Conflict(`Topic already exists with this name`);
                // }

                // Add timestamps and metadata
                data.created_at = new Date();
                
                if (req.user) {
                    data.created_by = req.user.id;
                }

                // If image is uploaded, store the file path
                if (req.file) {
                    data.image = req.file.path;
                }

                // Create new Topic
                const newTopic = new Model(data);
                const result = await newTopic.save();

                // Send the response
                res.status(201).json(result);
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
    
            // Find topic by ID
            const result = await Model.findOne({ _id: mongoose.Types.ObjectId(id) });
    
            // If topic not found, throw an error
            if (!result) {
                throw createError.NotFound("No Topic Found");
            }
    
            // Return the topic data
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
    list: async (req, res, next) => {
        try {
            const { name, disabled, is_inactive, page, limit, order_by, order_in } = req.query;
    
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
    
            // Fetch topics with aggregation pipeline
            const result = await Model.aggregate([
                { $match: query },
                { $sort: sorting },
                { $skip: _skip },
                { $limit: _limit },
                {
                    $lookup: {
                      from: "subjects", 
                      localField: "subject",
                      foreignField: "_id",
                      as: "subjectDetails",
                    },
                  },
                  {
                    $lookup: {
                      from: "classes", 
                      localField: "class",
                      foreignField: "_id",
                      as: "classDetails",
                    },
                  },
                  {
                    $lookup: {
                      from: "chapters",
                      localField: "chapter",
                      foreignField: "_id",
                      as: "chapterDetails",
                    },
                  },
                  { $unwind: "$subjectDetails" },
                  { $unwind: "$classDetails" },
                  { $unwind: "$chapterDetails" },

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
    update: async (req, res, next) => {
        try {
            uploadImage(req, res, async (err) => {
                if (err) {
                    return res.status(501).json({ error: err.message });
                }
    
                const { id } = req.params; // Extract the ID from URL parameters
                const data = req.body;
    
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
                    if (data.name) { // Ensure data.name exists to avoid unnecessary DB call
                        const entityExists = await Model.findOne({
                            name: data.name,
                            is_inactive: false,
                            _id: { $ne: id }, // Exclude the current entity being updated
                        }).lean();
    
                        if (entityExists) {
                            throw createError.Conflict("Entity with this name already exists.");
                        }
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
    
                    // If the entity was not found during the update (edge case)
                    if (!updatedEntity) {
                        throw createError.NotFound("Entity not found after update attempt.");
                    }
    
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
    
    // update: async (req, res, next) => {
    //     try {
    //         const { id } = req.params;
    
    //         // Check if the provided ID is valid
    //         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    //             throw createError.BadRequest("Invalid Parameters");
    //         }
    
    //         // Prepare the update data
    //         const data = req.body;
    
    //         // Check if there is any data to update
    //         if (!data && !req.file) {
    //             throw createError.BadRequest("No data provided for update");
    //         }
    
    //         // If an image file is uploaded, add it to the update data
    //         if (req.file) {
    //             data.image = req.file.path; // Assuming `image` is the field for the uploaded image
    //         }
    
    //         // Add updated_by and timestamp metadata
    //         if (req.user) {
    //             data.updated_by = req.user.id;
    //         }
    //         data.updated_at = Date.now();
    
    //         // Update the topic by ID
    //         const result = await Model.findByIdAndUpdate(
    //             { _id: mongoose.Types.ObjectId(id) },
    //             { $set: data },
    //             { new: true } // This returns the updated document
    //         );
    
    //         // If topic not found, throw an error
    //         if (!result) {
    //             throw createError.NotFound("Topic not found");
    //         }
    
    //         // Respond with the updated topic
    //         res.json(result);
    //     } catch (error) {
    //         if (error.isJoi === true) error.status = 422;
    //         return res.status(error.status || 500).send({
    //             error: {
    //                 status: error.status || 500,
    //                 message: error.message,
    //             },
    //         });
    //     }
    // },
    delete: async (req, res, next) => {
        try {
            const { id } = req.params;
    
            // Check if the provided ID is valid
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                throw createError.BadRequest("Invalid Parameters");
            }
    
            // Add the current timestamp for deletion
            const deleted_at = Date.now();
    
            // Update the topic to mark it as inactive (soft delete)
            const result = await Model.updateOne(
                { _id: mongoose.Types.ObjectId(id) },
                { $set: { is_inactive: true, deleted_at } }
            );
    
            // If the topic was not found, return an error
            if (result.nModified === 0) {
                throw createError.NotFound("Topic not found");
            }
    
            // Respond with the result of the deletion
            res.json({ message: "Topic marked as inactive", result });
        } catch (error) {
            next(error);
        }
    },
     getByChapter: async function (req, res) {
        const { id } = req.params; // Get subject ID from URL parameters
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
          const chapterId = mongoose.Types.ObjectId.isValid(id) ? mongoose.Types.ObjectId(id) : null;
          if (!chapterId) {
            return res.status(400).json({ message: "Invalid subject ID format" });
          }
      
          // Aggregation pipeline to filter by subject and disabled fields
          const query = {
            chapter: chapterId,
            disabled: false,
          };
      
          console.log("Query:", query); // Log the query for debugging
      
          let result = await Model.aggregate([
            { $match: query }, // Match the query for subject and disabled fields
            { $sort: sorting }, // Apply sorting
            { $skip: _skip }, // Pagination: Skip results based on page
            { $limit: _limit }, // Limit results per page
            {
              $lookup: {
                from: "chapters", // Ensure "subjects" is the correct collection name
                localField: "chapter",
                foreignField: "_id",
                as: "chapterDetails",
              },
            },
            { $unwind: "$chapterDetails" }, // Unwind the subjectDetails array
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
          res.status(500).json({ message: "Failed to retrieve topics by subject", error });
        }
      }                          
}