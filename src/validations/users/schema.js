const Joi = require('joi');

const UserPayloadSchema = {
  post: Joi.object({
    username: Joi.string().alphanum().min(5).max(32).required(),
    password: Joi.string().min(8).max(64).regex(/^\S+$/).required(),
    name: Joi.string().min(3).max(64).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: {
        allow: true,
      },
    }).required(),
    is_admin: Joi.bool().required(),
  }),
  put: Joi.object({
    username: Joi.string().alphanum().min(5).max(32).required(),
    name: Joi.string().min(3).max(64).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: {
        allow: true,
      },
    }).required(),
  }),
  putPassword: Joi.object({
    old_password: Joi.string().required(),
    password: Joi.string().min(8).max(64).regex(/^\S+$/).required(),
  }),
};

module.exports = { UserPayloadSchema };