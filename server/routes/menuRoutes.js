const express = require('express');
const authController = require('../controllers/authController');
const menuController = require('../controllers/menuController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, menuController.getMenusOfUser)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    menuController.addMenu
  );

// 权限
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/getAllMenus').get(menuController.getMenus);

router
  .route('/:id')
  .delete(menuController.deleteMenu)
  .patch(menuController.updateMenu);

module.exports = router;
