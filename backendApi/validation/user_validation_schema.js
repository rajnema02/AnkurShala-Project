const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
  user_name: Joi.string().required(),
  name: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
