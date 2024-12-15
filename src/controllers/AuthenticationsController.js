const { AuthenticationsService } = require("../services/mysql/AuthenticationsService");
const { UsersService } = require("../services/mysql/UsersService");
const { TokenManager } = require("../tokenize/TokenManager");
const { AuthenticationsValidator } = require("../validations/authentications");

class AuthenticationsController {
  constructor() {
    this._service = new AuthenticationsService();
    this._validator = AuthenticationsValidator;
    this._tokenManager = TokenManager;
    this._usersService = new UsersService();
  }

  async postAuthentication(req, res) {
    this._validator.postPayload(req.body);
    const results = await this._usersService.verifyUserCredentials(req.body.email, req.body.password);
    const user = {
      id: results.id,
      username: results.username,
      name: results.name,
      email: results.email,
      password: results.password,
      is_admin: results.is_admin,
    };
    const accessToken = this._tokenManager.generateAccessToken(user);
    const refreshToken = this._tokenManager.generateRefreshToken(user);

    await this._service.addRefreshToken(refreshToken);

    return res.status(201).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
  }

  async deleteAuthentication(req, res, isUpdatePassword = false) {
    const refreshToken = {
      refreshToken: req.body.refreshToken,
    };

    this._validator.deletePayload(refreshToken);

    await this._service.verifyRefreshToken(req.body.refreshToken);
    await this._service.deleteRefreshToken(req.body.refreshToken);

    if (isUpdatePassword) {
      return res.status(200).json({
        status: 'success',
        message: 'Password berhasil diupdate. Mohon lakukan autentikasi ulang'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  }

  async putAuthentication(req, res) {
    this._validator.putPayload(req.body);

    const { refreshToken } = req.body;

    await this._service.verifyRefreshToken(refreshToken);

    const verifyResults = this._tokenManager.verifyRefreshToken(refreshToken);
    const user = await this._usersService.getUserById(verifyResults.id);
    const accessToken = this._tokenManager.generateAccessToken(user);
    const newRefreshToken = this._tokenManager.generateRefreshToken(user);

    await this._service.deleteRefreshToken(refreshToken);
    await this._service.addRefreshToken(newRefreshToken);

    return res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  }
}

module.exports = { AuthenticationsController };