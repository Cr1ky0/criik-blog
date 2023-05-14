const express = require('express');
const authController = require('../controllers/authController');
const menuController = require('../controllers/menuController');

const router = express.Router();

// 获取我的menu
router.route('/getSelfMenu').get(menuController.getSelfMenu);

// 权限
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// router.route('/getAllMenus').get(menuController.getMenus);
router.route('/').post(menuController.addMenu);

router
  .route('/:id')
  .get(menuController.getMenusOfUser)
  .delete(menuController.deleteMenu)
  .patch(menuController.updateMenu);

module.exports = router;
