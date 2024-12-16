const ParkingLotAreaModel = require('../models/parking-lot-area.model');
const createError = require('http-errors');
const mongoose = require('mongoose');

module.exports = {
    create: async (req, res, next) => {
        try {
        const data = req.body;
        try {
            const dataExists = await ParkingLotAreaModel.findOne({
                $or: [{ parking_lot_area_name: data.parking_lot_area_name }],
                is_inactive: false,
            }).lean();
            data.created_at = Date.now();
            if (req.user) {
                data.created_by = req.user.id;
            }
            const newData = new ParkingLotAreaModel(data);
            const result = await newData.save();
            res.json(newData);
            return;
        } catch (error) {
            next(error);
        }
        } catch (error) {
        next(error);
        }
    },
    get: async (req, res, next) => {
        try {
        const { id } = req.params;
        if (!id) {
            throw createError.BadRequest('Invalid Parameters');
        }
        const result = await ParkingLotAreaModel.findOne({
            _id: mongoose.Types.ObjectId(id),
        });
        if (!result) {
            throw createError.NotFound(`No ParkingLotArea Found`);
        }
        res.json(result);
        return;
        } catch (error) {
        next(error);
        }
    },
    list: async (req, res, next) => {
        try {
        const {
            parking_lot_area_name,
            disabled,
            is_inactive,
            created_by,
            updated_by,
            created_at,
            updated_at,
            deleted_at,
            restored_at,
            page,
            limit,
        } = req.query;
        const query = {};
        query.is_inactive = false;
        if (parking_lot_area_name) {
            query.parking_lot_area_name = {
            $regex: parking_lot_area_name,
            $options: 'i',
            };
        }
        if (disabled) {
            query.disabled = disabled;
        }
        if (is_inactive) {
            query.is_inactive = is_inactive;
        }
        if (created_by) {
            query.created_by = created_by;
        }
        if (updated_by) {
            query.updated_by = updated_by;
        }
        if (created_at) {
            query.created_at = created_at;
        }
        if (updated_at) {
            query.updated_at = updated_at;
        }
        if (deleted_at) {
            query.deleted_at = deleted_at;
        }
        if (restored_at) {
            query.restored_at = restored_at;
        }
        const options = {
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        };
        const result = await ParkingLotAreaModel.aggregate(
            [
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "created_by",
                        foreignField: "_id",
                        as: "created_by",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "updated_by",
                        foreignField: "_id",
                        as: "updated_by",
                    },
                },
                {
                    $unwind: {
                        path: "$created_by",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $unwind: {
                        path: "$updated_by",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        name: 1,
                        code: 1,
                        totalRows: 1,
                        totalColumns: 1,
                        disabled: 1,
                        is_inactive: 1,
                        created_by: {
                            _id: 1,
                            name: 1,
                        },
                        updated_by: {
                            _id: 1,
                            name: 1,
                        },
                        created_at: 1,
                        updated_at: 1,
                        deleted_at: 1,
                        restored_at: 1,
                    },
                },
                {
                    $sort: {
                        created_at: -1,
                    },
                },
                {
                    $skip: (options.page - 1) * options.limit,
                },
                {
                    $limit: options.limit,
                },
            ],
        )
        const resultCount = await ParkingLotAreaModel.countDocuments(query);
        res.json({
            data: result,
            meta: {
                current_page: options.page,
                from: (options.page - 1) * options.limit + 1,
                last_page: Math.ceil(resultCount / options.limit),
                per_page: options.limit,
                to: (options.page - 1) * options.limit + options.limit,
                total: resultCount,
            },
        });
        return;
        } catch (error) {
        next(error);
        }
    },
    count: async (req, res, next) => {
        try {
        const {
            parking_lot_area_name,
            disabled,
            is_inactive,
            created_by,
            updated_by,
            created_at,
            updated_at,
            deleted_at,
            restored_at,
        } = req.query;
        const query = {};
        query.is_inactive = false;
        if (parking_lot_area_name) {
            query.parking_lot_area_name = {
            $regex: parking_lot_area_name,
            $options: 'i',
            };
        }
        if (disabled) {
            query.disabled = disabled;
        }
        if (is_inactive) {
            query.is_inactive = is_inactive;
        }
        if (created_by) {
            query.created_by = created_by;
        }
        if (updated_by) {
            query.updated_by = updated_by;
        }
        if (created_at) {
            query.created_at = created_at;
        }
        if (updated_at) {
            query.updated_at = updated_at;
        }
        if (deleted_at) {
            query.deleted_at = deleted_at;
        }
        if (restored_at) {
            query.restored_at = restored_at;
        }
        const result = await ParkingLotAreaModel.countDocuments(query);
        res.json(result);
        return;
        } catch (error) {
        next(error);
        }
    },
    update: async (req, res, next) => {
        try {
        const { id } = req.params;
        try {
            const data = req.body;
            if (!id) {
            throw createError.BadRequest('Invalid Parameters');
            }
            if (!data) {
            throw createError.BadRequest('Invalid Parameters');
            }
            data.updated_at = Date.now();
            const result = await ParkingLotAreaModel.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            { $set: data }
            );
            res.json(result);
            return;
        } catch (error) {
            next(error);
        }
        } catch (error) {
        next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
        const { id } = req.params;
        if (!id) {
            throw createError.BadRequest('Invalid Parameters');
        }
        const deleted_at = Date.now();
        const result = await ParkingLotAreaModel.updateOne(
            { _id: mongoose.Types.ObjectId(id) },
            { $set: { is_inactive: true, deleted_at } }
        );
        res.json(result);
        return;
        } catch (error) {
        next(error);
        }
    },
    restore: async (req, res, next) => {
        try {
        const { id } = req.params;
        if (!id) {
            throw createError.BadRequest('Invalid Parameters');
        }
        const restored_at = Date.now();
        const result = await ParkingLotAreaModel.updateOne(
            { _id: mongoose.Types.ObjectId(id) },
            { $set: { is_inactive: false, restored_at } }
        );
        res.json(result);
        return;
        } catch (error) {
        next(error);
        }
    },
};
