const { AuthorizationError } = require("../exceptions/AuthorizationError");

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.is_admin ? 'admin' : 'member';

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      throw new AuthorizationError('Akses ditolak')
    }
  };
};

module.exports = { authorize };
