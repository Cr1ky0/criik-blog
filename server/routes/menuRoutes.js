const express = require('express');

const authController = require('../controllers/authController');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.use(authController.protect); // 全局保护
router.use(authController.restrictTo('admin'));

router.route('/getAllMenus').get(menuController.getMenus);

router
  .route('/')
  .get(menuController.getMenusOfUser)
  .post(menuController.addMenu);

router
  .route('/:id')
  .delete(menuController.deleteMenu)
  .patch(menuController.updateMenu);

module.exports = router;
