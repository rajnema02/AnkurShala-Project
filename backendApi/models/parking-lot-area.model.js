const mongoose = require('mongoose')
const debug = require('debug')(process.env.DEBUG+'mongodb');
const Schema = mongoose.Schema;

const ParkingLotAreaSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    code: String,
    totalRows: Number,
    totalColumns: Number,
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

ParkingLotAreaSchema.virtual('user', {
    ref: 'user',
    localField: 'created_by',
    foreignField: '_id',
});

ParkingLotAreaSchema.virtual('user', {
    ref: 'user',
    localField: 'updated_by',
    foreignField: '_id',
});

ParkingLotAreaSchema.set('toObject', { virtuals: true });

ParkingLotAreaSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ParkingLotArea', ParkingLotAreaSchema);