const { ClientError } = require("../exceptions/ClientError")

const ErrorGlobalHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  if (!err.isServer) {
    return next(err);
  }

  return res.status(500).json({
    status: 'fail',
    message: 'Terjadi kesalahan di server',
  });
};

module.exports = { ErrorGlobalHandler };