const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
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
        ref: 'User',
    },
    updated_by: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true }); // This will automatically add createdAt and updatedAt fields

brandSchema.virtual('products', {
    ref: 'product',
    localField: '_id',
    foreignField: 'brand',
});

brandSchema.set('toObject', { virtuals: true });

brandSchema.set('toJSON', { virtuals: true });

brandSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'products',
        select: 'title slug',
    });
    next();
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
