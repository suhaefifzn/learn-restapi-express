const express = require('express');
const { asyncRouteHelper } = require('../utils/asyncRouteHelper');
const { AuthenticationsController } = require('../controllers/AuthenticationsController');

const router = express.Router();
const authController = new AuthenticationsController();

router.post('/', asyncRouteHelper(async (req, res) => {
  await authController.postAuthentication(req, res);
}));

router.delete('/', asyncRouteHelper(async (req, res) => {
  await authController.deleteAuthentication(req, res);
}));

router.put('/', asyncRouteHelper(async (req, res) => {
  await authController.putAuthentication(req, res);
}));

module.exports = { router };