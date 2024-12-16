const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    parentId: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
    },
    children: [{
        type: mongoose.Types.ObjectId,
        ref: 'Category',
    }],
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

categorySchema.virtual('products', {
    ref: 'product',
    localField: '_id',
    foreignField: 'category',
});

categorySchema.virtual('parent', {
    ref: 'Category',
    localField: 'parentId',
    foreignField: '_id',
});

categorySchema.virtual('childrens', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parentId',
});

categorySchema.set('toObject', { virtuals: true });

categorySchema.set('toJSON', { virtuals: true });

categorySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'parent',
        select: 'name description',
    });
    this.populate({
        path: 'children',
        select: 'name description',
    });
    this.populate({
        path: 'products',
        select: 'title slug',
    });
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
