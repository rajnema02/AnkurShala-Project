const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cameraSchema = new Schema({
    camera_name: String,
    rtspurl: String,
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    updated_by: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    is_inactive: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
    },
    deleted_at: {
        type: Date,
    },
    restored_at: {
        type: Date,
    },
}, { timestamps: true, toJSON: { virtuals: true } });

cameraSchema.virtual('user', {
    ref: 'user',
    localField: 'created_by',
    foreignField: '_id',
});

cameraSchema.virtual('user', {
    ref: 'user',
    localField: 'updated_by',
    foreignField: '_id',
});

cameraSchema.set('toObject', { virtuals: true });

cameraSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Camera', cameraSchema);
