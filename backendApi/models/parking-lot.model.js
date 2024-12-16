const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParkingLotSchema = new Schema({
    totalSpaces: Number,
    type: {
        type: String,
        enum: ['row', 'column'],
    },
    code: String,
    occupiedBy: JSON,
    rowCode: String,
    parkingLotArea: {
        type: Schema.Types.ObjectId,
        ref: 'ParkingLotArea'
    },
    camera: {
        type: Schema.Types.ObjectId,
        ref: 'camera'
    },
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
    released_at: {
        type: Date,
    },
}, { timestamps: true, toJSON: { virtuals: true } });

ParkingLotSchema.virtual('cameras', {
    ref: 'camera',
    localField: 'camera',
    foreignField: '_id',
});

ParkingLotSchema.virtual('ParkingLotArea', {
    ref: 'ParkingLotArea',
    localField: 'parkingLotArea',
    foreignField: '_id',
});

ParkingLotSchema.virtual('user', {
    ref: 'user',
    localField: 'created_by',
    foreignField: '_id',
});

ParkingLotSchema.virtual('user', {
    ref: 'user',
    localField: 'updated_by',
    foreignField: '_id',
});

ParkingLotSchema.set('toObject', { virtuals: true });

ParkingLotSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ParkingLot', ParkingLotSchema);