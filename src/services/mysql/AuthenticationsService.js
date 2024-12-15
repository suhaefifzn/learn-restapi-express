const { InvariantError } = require("../../exceptions/InvariantError");
const { Authentications } = require("../../models/Authentications");

class AuthenticationsService {
  async addRefreshToken(token) {
    await Authentications.create({
      token,
    });
  }

  async deleteRefreshToken(token) {
    await Authentications.destroy({
      where: {
        token,
      },
    });
  }

  async verifyRefreshToken(token) {
    const results = await Authentications.findAll({
      attributes: ['token'],
      where: {
        token,
      },
    });

    if (results.length < 1) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }
}

module.exports = { AuthenticationsService };