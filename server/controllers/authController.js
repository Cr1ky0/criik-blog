const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

// 用于清除session计时器
let sessionTimer;

// 生成jwt
const signToken = (id) =>
  // JWT_SECRET设置在config.env中，是一个独特的32位的
  // 载荷一般用id来进行转换
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // JWT_EXPIRES_IN指定token生效时长
  });

// 创建并返回token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // cookie的一些选项
  const cookieOptions = {
    expires: new Date( // 有效时间
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // 将天转化为毫秒
    ),
    httpOnly: true,
  };

  // 仅在生产环境下设置secure属性
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// 发送验证码
const sendCode = async (req, res, user, operation, next, isLink = false) => {
  // 生成resetToken（验证码）
  let code = user.createPasswordResetToken();
  // 上面操作只是做了更改，还需要进行save操作才能保存到数据库
  await user.save({ validateBeforeSave: false }); // 强制关闭验证器保存

  // 邮箱接收验证码后
  // resetPassword方法内验证验证码（验证码也要加密存在数据库里）
  let message = `${operation}\n以下是验证码 \n${code}\n请勿将该邮件透露给其他任何人！\n如果你没有忘记密码，请忽略该邮件!`;
  // 如果是重置邮箱，给新邮箱发送链接
  if (isLink) {
    code = crypto.createHash('sha256').update(code).digest('hex');
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetEmail/${code}`;
    message = `这是你的邮箱重置链接，请点击验证:\n${resetURL}\n请妥善保管，勿将其发送给任何陌生人！`;
  }

  console.log(message);

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: '验证码-重置密码 (valid for 10 min)',
    //   message,
    // });

    // 设置session和有效时间
    req.session.code = code;
    req.session.user_id = user.id;

    // 如果上一个计时器存在则清除
    if (sessionTimer) clearTimeout(sessionTimer);
    // 设置时间后销毁session
    sessionTimer = setTimeout(() => {
      if (req.session) req.session.destroy();
    }, 60 * 60 * 1000);

    let sendMessage = '验证码已经发送至邮箱!';
    if (isLink) sendMessage = '链接已经发送至邮箱，请前往确认！';
    res.status(200).json({
      status: 'success',
      message: sendMessage,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('发送邮件出现了一个未知错误！请重试！!'), 500);
  }
};

// 注册过程
exports.signup = catchAsync(async (req, res, next) => {
  // 仅注册一般属性，避免例如权限等属性从前端获取直接创建
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});

// 登录过程
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 验证字段
  if (!email || !password) {
    return next(new AppError('请输入邮箱和密码！!', 400));
  }
  // 验证用户是否存在
  const user = await User.findOne({ email }).select('+password'); // 带+号后原本select为false的就可以被查询过来

  // 调用userSchema中的方法
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('邮箱不可用或密码错误！', 401));
  }

  createSendToken(user, 200, res);
});

/**** 使用JWT实现路由保护（非法访问）****/
exports.protect = catchAsync(async (req, res, next) => {
  // 请求头中authenticaton字段携带token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('你还没有登录，请登录后操作！', 401));
  }

  // promisify是node内置的一个方法，将方法封装成promise方法
  // decoded中存放了原来用于生成jwt token的数据，这里是id
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 如果令牌还在用户被删除了也不让登陆
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('用户不存在!', 401));
  }

  // 验证是否用户更改密码
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('用户最近更改了密码，请再次登录！', 401));
  }

  // 这里将user放到req后next
  // 后续路由从req.user获取id来进行更新或删除等操作，从而保障一定是针对自己的操作而不是由前端发来的id
  req.user = currentUser;
  next();
});

// 对role进行限制，不同role可能对不同的api进行操作，阻止没有权限的用户访问
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('你没有权限进行此操作！', 403));
    }

    next();
  };

// 对于密码重置，一般流程是发一个邮件从邮件内点击链接到更改密码的api
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('错误的email：用户不存在!', 404));
  }
  // 发送验证码
  sendCode(req, res, user, '忘记密码了？', next);
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 根据验证码进行加密，为了和数据的对比
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.body.code)
    .digest('hex');

  if (!req.session.code) {
    return next(new AppError('验证码到期，请重新发送验证码!', 400));
  }

  // 这里要用user_id查找不然不同客户端的重复验证码可能会产生混乱
  const user = await User.findById(req.session.user_id).select(
    '+passwordResetToken'
  );

  // 验证码错误
  if (hashedToken !== user.passwordResetToken) {
    return next(new AppError('验证码错误！', 400));
  }

  // 密码相同则不修改
  if (user.password === req.body.password)
    return next(new AppError('不能修改为相同的密码！', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  await user.save();

  // 销毁session
  req.session.destroy();

  createSendToken(user, 200, res);
});

// 更新密码
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // 验证旧密码是否匹配
  if (!(await user.correctPassword(req.body.oldPassword, user.password))) {
    return next(new AppError('旧密码输入错误，请重新输入！', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});

// TODO:更改邮箱

// 更改邮箱发送验证码可以沿用sendCode
exports.updateEmail = catchAsync(async (req, res, next) => {
  sendCode(req, res, req.user, '更改邮箱？', next);
});

// 重置邮箱时还需要对输入时的邮箱进行验证，发送邮件到该邮箱内进行验证
exports.sendLinkToNewEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.body.code)
    .digest('hex');

  // session计时验证
  if (!req.session.code) {
    return next(new AppError('验证码无效!', 400));
  }

  const user = await User.findById(req.session.user_id).select(
    '+passwordResetToken'
  );

  // 验证码错误
  if (hashedToken !== user.passwordResetToken) {
    return next(new AppError('验证码错误！', 400));
  }
  // email相同则不修改
  if (user.email === req.body.newEmail) {
    return next(new AppError('不能修改为相同的邮箱！', 400));
  }

  // 将新邮箱暂存至数据库
  user.newEmail = req.body.newEmail;
  await user.save({ validateBeforeSave: false });

  // 发送验证链接
  sendCode(req, res, user, '', next, true);
});

// 重置Email
exports.resetEmail = catchAsync(async (req, res, next) => {
  if (!req.session.code) {
    return next(new AppError('Token已超时!', 400));
  }
  const user = await User.findOne({
    passwordResetToken: req.params.token,
  });

  if (!user) {
    return next(new AppError('无效的Token', 400));
  }

  user.email = user.newEmail;
  user.passwordResetToken = undefined;
  user.newEmail = undefined;
  await user.save({ validateBeforeSave: false });

  // 销毁session
  req.session.destroy();
  clearTimeout(sessionTimer);

  createSendToken(user, 200, res);
});
