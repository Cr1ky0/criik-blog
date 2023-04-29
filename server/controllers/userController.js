const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');

// avatar

exports.resizeUserAvatar = catchAsync(async (req, res, next) => {
  if (!req.body.avatar) return next();
  const base64 = req.body.avatar.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  req.filename = `user-${req.user.id}.jpeg`;
  // 利用sharp对图像进行压缩
  await sharp(buffer)
    .resize(500, 500, { fit: 'outside' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/users/${req.filename}`);
  next();
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// 用于对已经登录的用户刷新其状态
exports.updateLoginState = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 阻止在这里更新密码
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('不能在这里更新密码！', 400));
  }

  // 过滤掉不能更新的字段
  const filteredBody = filterObj(req.body, 'name', 'brief');
  // 添加头像信息
  if (req.filename) filteredBody.avatar = req.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// 获取user的avatar值
exports.getUserAvatar = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('avatar');
  const { avatar } = user;
  res.status(200).json({
    status: 'success',
    data: {
      avatar,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
