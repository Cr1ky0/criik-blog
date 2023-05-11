const express = require('express');
const authController = require('../controllers/authController');
const menuController = require('../controllers/menuController');

const router = express.Router();

// 获取指定用户的menu（因为要展览）
router.route('/:id').get(menuController.getMenusOfUser);

// 权限
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// router.route('/getAllMenus').get(menuController.getMenus);
router.route('/').post(menuController.addMenu);

router
  .route('/:id')
  .delete(menuController.deleteMenu)
  .patch(menuController.updateMenu);

module.exports = router;
