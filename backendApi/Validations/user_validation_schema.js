const Joi = require('@hapi/joi')

const updateSchema = Joi.object({
    full_name: Joi.string(),
    company_name: Joi.string(),
    company_email: Joi.string(),
    company_mobile: Joi.string(),
    gstin: Joi.string()
})

module.exports = {
    updateSchema
}