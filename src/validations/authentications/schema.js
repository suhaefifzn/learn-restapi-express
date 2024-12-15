const Joi = require('joi');

const AuthenticationPayloadSchema = {
  post: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
  put: Joi.object({
    refreshToken: Joi.string().required(),
  }),
  delete: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = { AuthenticationPayloadSchema };