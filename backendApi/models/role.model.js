const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: "",
    },
    topRole: {
        type: mongoose.Types.ObjectId,
    },
    permissions: {
        type: Array,
        default: [],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    updated_by: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Role", RoleSchema);