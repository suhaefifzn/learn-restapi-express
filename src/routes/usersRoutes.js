const express = require('express');
const { jwtAuth } = require('../middleware/jwtAuth');
const { authorize } = require('../middleware/authorize');
const { asyncRouteHelper } = require('../utils/asyncRouteHelper');
const { UsersController } = require('../controllers/UsersController');

const usersController = new UsersController();
const router = express.Router();

router.post('/', [jwtAuth, authorize(['admin'])], asyncRouteHelper(async (req, res) => {
    await usersController.postUser(req, res);
}));

router.put('/', jwtAuth, asyncRouteHelper(async (req, res) => {
    await usersController.putUserData(req, res);
}));

router.put('/password', jwtAuth, asyncRouteHelper(async (req, res) => {
    await usersController.putUserPassword(req, res);
}));

router.get('/', [jwtAuth, authorize(['admin'])], asyncRouteHelper(async (req, res) => {
    await usersController.getUsers(req, res);
}));

router.get('/:username', [jwtAuth, authorize(['admin', 'member'])],
    asyncRouteHelper(async (req, res) => {
        const userRole = req.user.is_admin ? 'admin' : 'member';

        if (userRole === 'member') {
            await usersController.getMyProfile(req, res);
        } else if (userRole === 'admin') {
            await usersController.getUserProfile(req, res);
        }
    })
);

module.exports = { router };