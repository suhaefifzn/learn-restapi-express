const jwt = require('jsonwebtoken');
const appConfig = require('../config/app');
const { InvariantError } = require('../exceptions/InvariantError');

const jwtAuth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    throw new InvariantError('Token tidak ditemukan');
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], appConfig.token.jwt.access);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new InvariantError('Token kadaluarsa');
    }

    throw new InvariantError('Token invalid');
  }
};

module.exports = { jwtAuth };