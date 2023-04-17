const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// 上传图片
router.post(
  '/uploadAvator',
  authController.protect,
  userController.uploadAvator
);

// 登录注册
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// 更改密码
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

// 更换邮箱
router.post('/updateEmail', authController.protect, authController.updateEmail);
router.post(
  '/sendLinkToNewEmail',
  authController.protect,
  authController.sendLinkToNewEmail
);
router.get('/resetEmail/:token', authController.resetEmail);

// 更新个人信息
router.patch('/updateMe', authController.protect, userController.updateMe);
// 删除用户
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  ); // 获取所有用户信息

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
