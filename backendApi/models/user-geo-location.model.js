const mongoose = require("mongoose");

const UserGeoLocationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    lat: {
        type: String,
        required: true,
    },
    lng: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "",
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

module.exports = mongoose.model("UserGeoLocation", UserGeoLocationSchema);