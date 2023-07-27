const express = require('express');
const authController = require('../controllers/authController');
const menuController = require('../controllers/menuController');

const router = express.Router();

// 获取我的menu
router.route('/getSelfMenu').get(menuController.getSelfMenu);

// 权限
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// 全局初始化菜单的sort字段
router.patch('/initSort', menuController.initSortOfMenus);

// 全局初始化菜单的createAt字段
router.patch('/initCreateAt', menuController.initCreateAtOfMenu);

// 根据idList修改相关sort字段
router.patch('/changeSort', menuController.changeSort);

// router.route('/getAllMenus').get(menuController.getMenus);
router.route('/').post(menuController.addMenu);

// 获取指定id的Menu
router.get('/getMenuById/:id', menuController.getMenuById);

router
  .route('/:id')
  // .get(menuController.getMenusOfUser)
  .delete(menuController.deleteMenu)
  .patch(menuController.updateMenu);

module.exports = router;
