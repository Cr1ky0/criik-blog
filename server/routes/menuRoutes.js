const express = require('express');

const authController = require('../controllers/authController');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.use(authController.protect); // 全局保护
router.use(authController.restrictTo('admin'));

router.route('/getAllMenus').get(menuController.getMenus);

router.post('/addMenu', menuController.addMenu);
router.delete('/deleteMenu/:id', menuController.deleteMenu);
router.patch('/updateMenu/:id', menuController.updateMenu);

router.route('/').get(menuController.getMenusOfUser);

module.exports = router;
