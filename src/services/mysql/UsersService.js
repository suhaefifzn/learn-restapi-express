const { errDuplicateEntry } = require('../../utils/errDuplicateEntry');
const { InvariantError } = require('../../exceptions/InvariantError');
const { AuthenticationError } = require('../../exceptions/AuthenticationError');
const { UniqueConstraintError } = require('sequelize');
const { Users } = require('../../models/Users');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

class UsersService {
  async addUser(payload) {
    try {
      const id = `user-${nanoid(8)}`;
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const results = await Users.create({
        id,
        username: payload.username,
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        is_admin: payload.is_admin,
      });

      return results.dataValues.id;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new InvariantError(errDuplicateEntry(error));
      }
    }
  }

  async updateUser(userId, payload) {
    try {
      const newData = {
        username: payload.username,
        name: payload.name,
        email: payload.email,
      };

      await Users.update(newData, {
        where: {
          id: userId,
        }
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new InvariantError(errDuplicateEntry(error));
      }
    }
  }

  async updateUserPassword(userId, payload) {
    const hashedPassword = {
      password: await bcrypt.hash(payload.password, 10),
    };

    await Users.update(hashedPassword, {
      where: {
        id: userId,
      }
    });
  }

  async getAllUsers() {
    const results = await Users.findAll({
      attributes: ['id', 'username', 'name', 'email', 'is_admin', 'created_at', 'updated_at'],
      where: {
        is_admin: false,
      },
    });

    return results;
  }

  async getUserByUsername(username) {
    const results = await Users.findAll({
      attributes: ['id', 'username', 'email', 'name', 'is_admin'],
      where: {
        username,
      },
    });

    if (results.length < 1) {
      throw new InvariantError('Username pengguna tidak ditemukan');
    }

    return results[0].dataValues;
  }

  async getUserById(id) {
    const results = await Users.findAll({
      attributes: ['id', 'username', 'email', 'name', 'password', 'is_admin'],
      where: {
        id,
      },
    });

    if (results.length < 1) {
      throw new InvariantError('ID pengguna tidak ditemukan');
    }

    return results[0].dataValues;
  }

  async verifyUserCredentials(email, password) {
    const results = await Users.findAll({
      attributes: ['id', 'username', 'name', 'password', 'email', 'is_admin'],
      where: {
        email,
      },
    });

    if (results.length < 1) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { password: hashedPassword } = results[0].dataValues;
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return results[0].dataValues;
  }
}

module.exports = { UsersService };