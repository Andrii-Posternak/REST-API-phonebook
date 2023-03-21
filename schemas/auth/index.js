const Joi = require("joi");

const registerSchema = Joi.object({
  subscription: Joi.string()
    .valueOf("starter", "pro", "business")
    .default("starter"),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
