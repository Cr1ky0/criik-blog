const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// 登录注册
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// 更改密码
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);

// 下面所有的routes都要用protect
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

// 更换邮箱
router.post('/updateEmail', authController.updateEmail);
router.post('/sendLinkToNewEmail', authController.sendLinkToNewEmail);
router.get('/resetEmail/:token', authController.resetEmail);

// 更新个人信息
router.patch(
  '/updateMe',
  userController.uploadAvator,
  userController.resizeUserAvator,
  userController.updateMe
);

// 删除用户
router.delete(
  '/deleteMe',
  authController.restrictTo('admin'),
  userController.deleteMe
);

router
  .route('/')
  .get(authController.restrictTo('admin'), userController.getAllUsers); // 获取所有用户信息

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
