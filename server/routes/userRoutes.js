const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// 登录
router.post('/login', authController.login);

// 注册
// router.post('/signup', authController.signup);

// 更改密码
// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword', authController.resetPassword);

// 获取头像
router.get('/getUserAvatar/:id', userController.getUserAvatar);

// 获取我的信息
router.get('/getMyInfo', userController.getMyInfo);

// 更新个人信息
router.patch(
  '/updateMe',
  authController.protect,
  authController.restrictTo('admin', 'user'),
  userController.resizeUserAvatar,
  userController.updateMe
);

// 限制权限
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// reset邮箱
router.get('/resetEmail/:token', authController.resetEmail);

// 更换邮箱
router.post('/updateEmail', authController.updateEmail);
router.post('/sendLinkToNewEmail', authController.sendLinkToNewEmail);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/updateLoginState', userController.updateLoginState);

// 删除用户
router.delete('/deleteMe', userController.deleteMe);

router.route('/').get(userController.getAllUsers); // 获取所有用户信息

router.route('/:id').get(userController.getUser);

module.exports = router;
