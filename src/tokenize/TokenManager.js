const { InvariantError } = require("../exceptions/InvariantError");
const appConfig = require('../config/app');
const jwt = require('jsonwebtoken');

const TokenManager = {
  generateAccessToken: (payload) => {
    const accessToken = jwt.sign(payload, appConfig.token.jwt.access, {
      expiresIn: appConfig.token.jwt.age,
    });
    return accessToken;
  },
  generateRefreshToken: (payload) => {
    const refreshToken = jwt.sign(payload, appConfig.token.jwt.refresh);
    return refreshToken;
  },
  verifyRefreshToken: (refreshToken) => {
    try {
      const decoded = jwt.verify(refreshToken, appConfig.token.jwt.refresh);
      return decoded;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid.');
    }
  },
};

module.exports = { TokenManager };