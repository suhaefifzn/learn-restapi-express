const { AuthenticationsController } = require('../controllers/AuthenticationsController');
const { AuthorizationError } = require('../exceptions/AuthorizationError');
const { InvariantError } = require('../exceptions/InvariantError');
const { UsersService } = require('../services/mysql/UsersService');
const { UsersValidator } = require('../validations/users/');
const bcrypt = require('bcrypt');

class UsersController {
  constructor() {
    this._service = new UsersService();
    this._validator = UsersValidator;
  }

  async postUser(req, res) {
    this._validator.postPayload(req.body);
    const id = await this._service.addUser(req.body);

    return res.status(201).json({
      status: 'success',
      data: { id },
    });
  }

  async putUserData(req, res) {
    const payload = {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
    };

    this._validator.putPayload(payload);

    const { id } = req.user;

    if (id !== req.body.id) {
      throw new AuthorizationError('Akses ditolak');
    }

    await this._service.updateUser(id, req.body);

    return res.status(200).json({
      status: 'success',
      message: 'Data user berhasil diupdate',
    });
  }

  async putUserPassword(req, res) {
    const payload = {
      old_password: req.body.old_password,
      password: req.body.password, // new password
    };

    this._validator.putPasswordPayload(payload);

    if (req.user.id !== req.body.id) {
      throw new AuthorizationError('Akses ditolak');
    }

    const matchPassword = await bcrypt.compare(payload.old_password, req.user.password);

    if (!matchPassword) {
      throw new InvariantError('Password lama tidak sesuai');
    }

    await this._service.updateUserPassword(req.user.id, payload);

    const authController = new AuthenticationsController();
    await authController.deleteAuthentication(req, res, true);
  }

  async getMyProfile(req, res) {
    const { username } = req.user;

    if (username === req.params.username) {
      const results = await this._service.getUserByUsername(username);

      return res.status(200).json({
        status: 'success',
        data: { ...results },
      });
    }

    throw new AuthorizationError('Akses ditolak');
  }

  async getUserProfile(req, res) {
    const { username } = req.params;
    const results = await this._service.getUserByUsername(username);

    return res.status(200).json({
      status: 'success',
      data: {
        ...results,
      },
    });
  }

  async getUsers(req, res) {
    const results = await this._service.getAllUsers();

    return res.status(200).json({
      status: 'success',
      data: {
        users: results,
      },
    });
  }
}

module.exports = { UsersController };