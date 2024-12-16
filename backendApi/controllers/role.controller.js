const RoleModel = require('../models/role.model');
const createError = require('http-errors');
const mongoose = require('mongoose');

module.exports = {
    create: async (req, res, next) => {
        try {
            const data = req.body;
            try {
                data.created_at = Date.now();
                if (req.user) {
                    data.created_by = req.user.id;
                }
                const newData = new RoleModel(data);
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
            const result = await RoleModel.findOne({
                _id: mongoose.Types.ObjectId(id),
            });
            if (!result) {
                throw createError.NotFound(`No Role Found`);
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
                name,
                description,
                topRole,
                permissions,
                created_by,
                updated_by,
                created_at,
                updated_at,
                page=1,
                limit=10,
            } = req.query;
            const query = {};
            if (name) {
                query.name = name;
            }
            if (description) {
                query.description = description;
            }
            if (topRole) {
                query.topRole = topRole;
            }
            if (permissions) {
                query.permissions = permissions;
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
            const result = await RoleModel.find(query)
                .limit(limit)
                .skip((page - 1) * limit);
            const total = await RoleModel.countDocuments(query);
            res.json({
                data: result,
                total,
                page,
                limit,
            });
            return;
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                throw createError.BadRequest('Invalid Parameters');
            }
            const data = req.body;
            data.updated_at = Date.now();
            if (req.user) {
                data.updated_by = req.user.id;
            }
            const result = await RoleModel.updateOne(
                {
                    _id: mongoose.Types.ObjectId(id),
                },
                {
                    $set: data,
                },
            );
            res.json(result);
            return;
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
            const result = await RoleModel.deleteOne({
                _id: mongoose.Types.ObjectId(id),
            });
            res.json(result);
            return;
        } catch (error) {
            next(error);
        }
    },
};
