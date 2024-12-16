const UserGeoLocationModel = require('../models/user-geo-location.model');
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
                    data.user = req.user.id;
                }
                const newData = new UserGeoLocationModel(data);
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
            const result = await UserGeoLocationModel.findOne({
                _id: mongoose.Types.ObjectId(id),
            });
            if (!result) {
                throw createError.NotFound(`No UserGeoLocation Found`);
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
                user,
                lat,
                lng,
                tag,
                created_by,
                updated_by,
                created_at,
                updated_at,
                page=1,
                limit=10,
            } = req.query;
            const query = {};
            if (user) {
                query.user = user;
            }
            if (lat) {
                query.lat = lat;
            }
            if (lng) {
                query.lng = lng;
            }
            if (tag) {
                query.tag = tag;
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
            const result = await UserGeoLocationModel.find(query).skip((page - 1) * limit).limit(limit);
            res.json(result);
            return;
        } catch (error) {
            next(error);
        }
    },
};