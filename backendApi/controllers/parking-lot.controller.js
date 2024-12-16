const ParkingLotModel = require('../models/parking-lot.model');
const createError = require('http-errors');
const mongoose = require('mongoose')

module.exports = {
    create: async (req, res, next) => {
        try {
        const data = req.body;
        try {
            data.created_at = Date.now();
            if (req.user) {
            data.created_by = req.user.id;
            }
            const newData = new ParkingLotModel(data);
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
        const result = await ParkingLotModel.findOne({
            _id: mongoose.Types.ObjectId(id),
        });
        if (!result) {
            throw createError.NotFound(`No ParkingLot Found`);
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
            parking_lot_name,
            vehiclePlateNumber,
            disabled,
            is_inactive,
            created_by,
            updated_by,
            created_at,
            updated_at,
            released_at,
            deleted_at,
            restored_at,
            page,
            limit,
        } = req.query;
        const query = {};
        query.is_inactive = false;
        if (parking_lot_name) {
            query.parking_lot_name = { $regex: parking_lot_name, $options: 'i' };
        }
        if (vehiclePlateNumber) {
            query['occupiedBy.vehiclePlateNumber'] = { $regex: vehiclePlateNumber, $options: 'i' };
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
        if (released_at) {
            console.log(released_at)
            query.released_at = (released_at == 1 ? {$exists: true} : {$exists: false});
            console.log(query.released_at)
        }
        if (deleted_at) {
            query.deleted_at = deleted_at;
        }
        if (restored_at) {
            query.restored_at = restored_at;
        }
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
        };
        const result = await ParkingLotModel.aggregate(
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
                    $lookup: {
                        from: "parkinglotareas",
                        localField: "parkingLotArea",
                        foreignField: "_id",
                        as: "parkingLotArea",
                    },
                },
                {
                    $unwind: {
                        path: "$parkingLotArea",
                        preserveNullAndEmptyArrays: true,
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
                    $lookup: {
                        from: "cameras",
                        localField: "camera",
                        foreignField: "_id",
                        as: "camera",
                    },
                },
                {
                    $unwind: {
                        path: "$camera",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        totalSpaces: 1,
                        type: 1,
                        code: 1,
                        occupiedBy: 1,
                        rowCode: 1,
                        parkingLotArea: {
                            _id: 1,
                            name: 1,
                        },
                        camera: {
                            _id: 1,
                            camera_name: 1,
                        },
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
                        released_at: 1,
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
        const resultCount = await ParkingLotModel.countDocuments(query);
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
        } catch (error) {
        next(error);
        }
    },
    update: async (req, res, next) => {
        try {
        const { id } = req.params;
        const data = req.body;
        console.log(data);
        if (!id) {
            throw createError.BadRequest('Invalid Parameters');
        }
        try {
            data.updated_at = Date.now();
            if (req.user) {
            data.updated_by = req.user.id;
            }
            const result = await ParkingLotModel.updateOne(
            {
                _id: mongoose.Types.ObjectId(id),
            },
            {
                $set: data,
            }
            );
            if (!result) {
            throw createError.NotFound(`No ParkingLot Found`);
            }
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
        try {
            const result = await ParkingLotModel.findOneAndUpdate(
            {
                _id: mongoose.Types.ObjectId(id),
            },
            {
                is_inactive: true,
                deleted_at: Date.now(),
                deleted_by: req.user.id,
            },
            { new: true }
            );
            if (!result) {
            throw createError.NotFound(`No ParkingLot Found`);
            }
            res.json(result);
            return;
        } catch (error) {
            next(error);
        }
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
        try {
            const result = await ParkingLotModel.findOneAndUpdate(
            {
                _id: mongoose.Types.ObjectId(id),
            },
            {
                is_inactive: false,
                restored_at: Date.now(),
                restored_by: req.user.id,
            },
            { new: true }
            );
            if (!result) {
            throw createError.NotFound(`No ParkingLot Found`);
            }
            res.json(result);
            return;
        } catch (error) {
            next(error);
        }
        } catch (error) {
        next(error);
        }
    },
};
