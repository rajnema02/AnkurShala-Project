const Joi = require('@hapi/joi')

const createSchema = Joi.object({
    name: Joi.string().required(),
    remark: Joi.string(),
    topRole: Joi.string(),
    agreements: Joi.array(),
    disabled: Joi.boolean(),
    is_inactive: Joi.boolean(),
    permissions: Joi.object(),
})

const updateSchema = Joi.object({
    remark: Joi.string(),
    topRole: Joi.string(),
    agreements: Joi.array(),
    disabled: Joi.boolean(),
    is_inactive: Joi.boolean(),
    permissions: Joi.object(),
    display_name: Joi.string()
})

module.exports = {
    createSchema,
    updateSchema
}