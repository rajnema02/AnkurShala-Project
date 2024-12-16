const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    class: {
      type: mongoose.Types.ObjectId,
      ref: "Class",
    },
    subject: {
      type: mongoose.Types.ObjectId,
      ref: "Subject",
    },
    image: {
        type: String, 
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    is_inactive: {
      type: Boolean,
      default: false,
    },
    created_by: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Assuming 'User' is the model for your users
    },
    updated_by: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Assuming 'User' is the model for your users
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;
