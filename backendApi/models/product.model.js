const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    afterDiscount: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    brand: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    attributes: {
        type: Array,
        default: [],
    },
    sku: {
        type: String,
        required: true,
    },
    main_image: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
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
    created_by: {
        type: mongoose.Types.ObjectId,
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
});

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;
