const createHttpError = require('http-errors');
const Brand = require('../models/brand.model');

// Controller function to get all brands
const listBrands = async (req, res, next) => {
    try {
        const {
            name,
            description,
            disabled,
            is_inactive,
            page,
            limit,
            order_by,
            order_in,
        } = req.query;

        const _page = page ? parseInt(page) : 1;
        const _limit = limit ? parseInt(limit) : 20;
        const _skip = (_page - 1) * _limit;

        let sorting = {};
        if (order_by) {
            sorting[order_by] = order_in === 'desc' ? -1 : 1;
        } else {
            sorting['_id'] = -1;
        }

        const query = {};
        if (name) {
            query.name = new RegExp(name, 'i');
        }
        if (description) {
            query.description = new RegExp(description, 'i');
        }

        const brands = await Brand.aggregate([
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
                    from: 'products',
                    localField: '_id',
                    foreignField: 'brand',
                    as: 'products',
                },
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    disabled: 1,
                    createdAt: 1,
                    is_inactive: 1,
                    products: {
                        $size: '$products',
                    },
                },
            }
        ]);

        const brandsCount = await Brand.countDocuments(query);

        res.json({
            data: brands,
            meta: {
                current_page: _page,
                from: _skip + 1,
                last_page: Math.ceil(brandsCount / _limit),
                per_page: _limit,
                to: Math.min(_skip + _limit, brandsCount),
                total: brandsCount,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getBrandById = async (req, res, next) => {
    try {
        const brandId = req.params.id;
        const brand = await Brand.findById(brandId);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.json(brand);
    } catch (error) {
        next(error);
    }
}

// Controller function to create a new brand
const createBrand = async (req, res, next) => {
    try {
        const { name, description, disabled } = req.body;
        // validate required fields
        if (!name || !description) {
            throw new createHttpError.BadRequest('Missing required fields: name, description');
        }
        const newBrandTemp = {
            name,
            description,
            disabled
        };
        const newBrand = await Brand.create(newBrandTemp);
        res.status(201).json(newBrand);
    } catch (error) {
        next(error);
    }
};

// Controller function to update a brand by ID
const updateBrandById = async (req, res, next) => {
    try {
        const brandId = req.params.id; // Assuming the ID is passed as a URL parameter
        const { name, description, disabled, is_inactive } = req.body;

        // Find the brand by ID and update its fields
        const updatedBrand = await Brand.findByIdAndUpdate(
            brandId,
            { name, description, disabled, is_inactive },
            { new: true } // To return the updated brand
        );

        if (!updatedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        res.json(updatedBrand);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateBrandById,
    listBrands,
    createBrand,
    getBrandById,
    // Add other controller functions here as needed
};
