const express = require('express');

const authController = require('../controllers/authController');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.use(authController.protect); // 全局保护

router
  .route('/getAllMenus')
  .get(authController.restrictTo('admin'), menuController.getMenus);
router.route('/addParentMenu').post(menuController.addParentMenu);
router.route('/addChildMenu').post(menuController.addChildMenu);

router.route('/').get(menuController.getMenusOfUser);

module.exports = router;
