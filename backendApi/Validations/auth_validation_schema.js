const Joi = require('@hapi/joi')

const registerSchema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    mobile: Joi.required(),
    role: Joi.string().required(),
    topUser: Joi.string().required(),
    tagged_vendor: Joi.string(),
    tagged_influencers: Joi.array(),
    password: Joi.string().min(2).required(),
    cnf_password: Joi.string().min(2).required(),
})

const registerVendorSchema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    mobile: Joi.required(),
    legal_name: Joi.string(),
    pickup_address: Joi.array(),
    supplier_contact_no: Joi.string(),
    phone_number: Joi.string(),
    billing_address: Joi.string(),
    categories: Joi.array(),
    commissions: Joi.array(),
    gts_no: Joi.string(),
    gst_certificate_file_path: Joi.string(),
    pan_card_file_path: Joi.string(),
    cancel_cheque_file_path: Joi.string(),
    MSME_certificates_file_path: Joi.string(),
    other_certificates_path: Joi.string(),
    onboard_by: Joi.string(),
    password: Joi.string().min(2).required(),
    cnf_password: Joi.string().min(2).required(),
})

const registerUserSchema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    mobile: Joi.required(),
    password: Joi.string().min(2).required(),
    cnf_password: Joi.string().min(2).required(),
})

const loginSchema = Joi.object({
    authid: Joi.string().lowercase().required(),
    password: Joi.string().min(2).required(),
})

const loginUserSchema = Joi.object({
    authid: Joi.string().lowercase().required()
})

const verifyOtpSchema = Joi.object({
    authid: Joi.string().lowercase().required(),
    otp: Joi.string().required()
})

module.exports = {
    registerUserSchema,
    registerVendorSchema,
    loginSchema,
    loginUserSchema,
    verifyOtpSchema,
    registerSchema
}
