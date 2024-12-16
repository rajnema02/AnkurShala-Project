const Model = require("../models/camera.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const ModelName = "Camera";

module.exports = {
    create: async (req, res, next) => {
        try {
            const data = req.body;
            try {
                data.created_at = Date.now();
                if (req.user) {
                    data.created_by = req.user.id;
                }
                const newData = new Model(data);
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
                throw createError.BadRequest("Invalid Parameters");
            }
            const result = await Model.findOne({ _id: mongoose.Types.ObjectId(id) });
            if (!result) {
                throw createError.NotFound(`No ${ModelName} Found`);
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
                camera_name,
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
            if (camera_name) {
                query.camera_name = { $regex: camera_name, $options: "i" };
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
                page: parseInt(page, 10) || 1,
                limit: parseInt(limit, 10) || 10,
                populate: ["created_by", "updated_by"],
                sort: { created_at: -1 },
            };
            const result = await Model.aggregate(
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
                            camera_name: 1,
                            rtspurl: 1,
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
            const resultCount = await Model.countDocuments(query);
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
    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            if (!id) {
                throw createError.BadRequest("Invalid Parameters");
            }
            try {
                data.updated_at = Date.now();
                if (req.user) {
                    data.updated_by = req.user.id;
                }
                const result = await Model.findByIdAndUpdate(
                    { _id: mongoose.Types.ObjectId(id) },
                    data,
                    { new: true }
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
                throw createError.BadRequest("Invalid Parameters");
            }
            const deleted_at = Date.now();
            const result = await Model.updateOne(
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
                throw createError.BadRequest("Invalid Parameters");
            }
            const restored_at = Date.now();
            const result = await Model.updateOne(
                { _id: mongoose.Types.ObjectId(id) },
                { $set: { is_inactive: false, restored_at } }
            );
            res.json(result);
            return;
        } catch (error) {
            next(error);
        }
    }
};