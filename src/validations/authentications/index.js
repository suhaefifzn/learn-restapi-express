const { InvariantError } = require("../../exceptions/InvariantError");
const { AuthenticationPayloadSchema } = require("./schema")

const AuthenticationsValidator = {
  postPayload: (payload) => {
    const results = AuthenticationPayloadSchema.post.validate(payload);

    if (results.error) {
      throw new InvariantError(results.error.message);
    }
  },
  putPayload: (payload) => {
    const results = AuthenticationPayloadSchema.put.validate(payload);

    if (results.error) {
      throw new InvariantError(results.error.message);
    }
  },
  deletePayload: (payload) => {
    const results = AuthenticationPayloadSchema.delete.validate(payload);

    if (results.error) {
      throw new InvariantError(results.error.message);
    }
  },
};

module.exports = { AuthenticationsValidator };