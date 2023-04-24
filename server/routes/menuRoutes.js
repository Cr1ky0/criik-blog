const express = require('express');

const authController = require('../controllers/authController');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.use(authController.protect); // 全局保护

router
  .route('/getAllMenus')
  .get(authController.restrictTo('admin'), menuController.getMenus);

router
  .route('/')
  .get(menuController.getMenusOfUser)
  .post(menuController.addMenu);

module.exports = router;
