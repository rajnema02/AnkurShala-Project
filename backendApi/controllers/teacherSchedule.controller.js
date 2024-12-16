const Model = require("../models/teacherSchedule.model");
const User = require('../models/user.model');
const createError = require("http-errors");
const mongoose = require("mongoose");
const ModelName = "TeacherSchedule";
const { uploadImage } = require("../Helpers/helper_functions");

module.exports = {
    create:async (req, res) => {
        try {
            const data = req.body
            console.log("data",data)
    
            // const user = await User.findById(data.userId);
    
            // if (!user || user.name !== 'Teacher') {
            //     return res.status(403).json({ message: 'Access denied. Only teachers can create schedules.' });
            // }    
            const newSchedule = new Model({
                ...data,
                created_by: data.userId,
                updated_by: data.userId,
            });
    
            // Save the schedule to the database
            await newSchedule.save();
    
            // Send a success response
            res.status(201).json({ message: 'Teacher schedule created successfully', schedule: newSchedule });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating schedule', error });
        }
    },
    list : async (req, res, next) => {
        try {
          const {
            start_time,
            end_time,
            classes,
            subjects,
            disabled,
            is_inactive,
            page,
            limit,
            order_by,
            order_in,
          } = req.query;
      
          // Ensure page and limit are valid numbers, or set defaults
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
          if (start_time) {
            query.start_time = start_time;
          }
          if (end_time) {
            query.end_time = end_time;
          }
          if (classes) {
            query.classes = classes;
          }
          if (subjects) {
            query.subjects = { $in: subjects.split(',') };
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
            {
              $lookup: {
                from: 'classes',
                localField: 'classes',
                foreignField: '_id',
                as: 'classDetails',
              },
            },
            {
              $unwind: {
                path: '$classDetails',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'subjects', 
                localField: 'subjects',
                foreignField: '_id',
                as: 'subjectDetails',
              },
            }
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
              to: Math.min(_skip + _limit, resultCount),
              total: resultCount,
            },
          });
        } catch (error) {
          next(error);
        }
      },
delete: async (req, res, next) => {
        try {
          const { id } = req.params; // Get the teacher schedule ID from the request parameters
          if (!id) {
            throw createError.BadRequest("Invalid Parameters");
          }
          const deleted_at = Date.now(); // Record the deletion time
      
          // Update the teacher schedule entry to mark it as inactive
          const result = await TeacherSchedule.updateOne(
            { _id: mongoose.Types.ObjectId(id) },
            { $set: { disabled: true, is_inactive: true, deleted_at } }
          );
      
          // If no records were modified, the ID may not exist
          if (result.nModified === 0) {
            throw createError.NotFound("Teacher schedule not found");
          }
      
          res.json({ message: "Teacher schedule deleted successfully", result });
        } catch (error) {
          next(error);
        }
      },
//   search: async (req, res, next) => {
//     try {
//         const { classId, subject, chapter, topic, date, start_time, end_time } = req.query;

//         const query = {};

//         if (classId) query.classes = mongoose.Types.ObjectId(classId);
//         if (subject) query.subjects = { $in: [subject] };
        
//         // If chapter and topic are part of a related schema, adjust here
//         if (chapter) query.chapter = chapter; 
//         if (topic) query.topic = topic;
        
//         // Date filter - if you want exact date or within a range
//         if (date) query.date = new Date(date);
        
//         if (start_time) query.start_time = start_time;
//         if (end_time) query.end_time = end_time;

//         // Execute the query, ensuring all conditions are applied
//         const schedules = await Model.find(query)
//             .populate('classes', 'name') // Assuming you have a 'name' field in Class
//             .exec();

//         res.json({ message: "Search results", schedules });
//     } catch (error) {
//         next(error);
//     }
// }

search: async (req, res, next) => {
  try {
      // Log the entire request object for debugging
      console.log("Request received:", req);

      // Destructure the required parameters from the query
      const { classes, subject, start_time, end_time } = req.query;
      console.log("Received query parameters:", req.query); // Log the received parameters

      // Ensure all required fields are provided
      if (!classes || !start_time || !end_time) {
          return res.status(400).json({ message: "classes, start_time, and end_time are required." });
      }

      // Construct the query object
      const query = {
          classes: mongoose.Types.ObjectId(classes), // Match the class ID
          start_time, // Exact match for start_time
          end_time,   // Exact match for end_time
          disabled: false,        // Only active schedules
          is_inactive: false      // Only active schedules
      };

      // If subject is provided, add it to the query
      if (subject) {
          query.subjects = { $in: [subject] }; // Match if subject exists in the subjects array
      }

      // Log the constructed query for debugging purposes
      console.log("Constructed Query:", query);

      // Fetch schedules from the database based on the constructed query
      const schedules = await Model.find(query)
          .populate('classes', 'name') // Populate class names
          .exec();

      // Log the fetched schedules for debugging
      console.log("Fetched Schedules:", schedules);

      // Return the results
      res.json({ message: "Search results", schedules });
  } catch (error) {
      // Handle errors by passing them to the next middleware
      console.error("Error in search function:", error); // Log the error for debugging
      res.status(500).json({ message: "Internal server error", error: error.message }); // Return a 500 error response
      next(error);
  }
}


}