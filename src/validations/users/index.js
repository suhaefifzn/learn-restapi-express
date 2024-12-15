const { InvariantError } = require('../../exceptions/InvariantError');
const { UserPayloadSchema } = require('./schema');

const UsersValidator = {
  postPayload: (payload) => {
    const results = UserPayloadSchema.post.validate(payload);

    if (results.error) {
      throw new InvariantError(results.error.message);
    }
  },
  putPayload: (payload) => {
    const results = UserPayloadSchema.put.validate(payload);

    if (results.error) {
      throw new InvariantError(results.error.message);
    }
  },
  putPasswordPayload: (payload) => {
    const results = UserPayloadSchema.putPassword.validate(payload);

    if (results.error) {
      throw new InvariantError(results.error.message);
    }
  }
};

module.exports = { UsersValidator };