const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('请输入邮箱和密码！!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password'); // 带+号后原本select为false的就可以被查询过来

  // 调用userSchema中的方法
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('邮箱不可用或密码错误！', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

/**** 使用JWT实现路由保护（非法访问）****/
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
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

  // 2) Verification token
  // promisify是node内置的一个方法，将方法封装成promise方法
  // decoded中存放了原来用于生成jwt token的数据，这里是id
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  // 如果令牌还在用户被删除了也不让登陆
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('用户不存在!', 401));
  }

  // 4) Check if user changed password after the token was issued
  // 验证是否用户更改密码
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('用户最近更改了密码，请再次登录！', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

// 对role进行限制，不同role可能对不同的api进行操作，阻止没有权限的用户访问
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    console.log(roles, req.user);
    if (!roles.includes(req.user.role)) {
      return next(new AppError('你没有权限进行此操作！', 403));
    }

    next();
  };

// 对于密码重置，一般流程是发一个邮件从邮件内点击链接到更改密码的api
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('错误的email：用户不存在!', 404));
  }

  // 2) Generate the random reset token
  const code = user.createPasswordResetToken();
  // 上面操作只是做了更改，还需要进行save操作才能保存到数据库
  await user.save({ validateBeforeSave: false }); // 强制关闭验证器保存

  // 3) Send it to user's email
  // 邮箱接收验证码后
  // resetPassword方法内验证验证码（验证码也要加密存在数据库里）
  const message = `忘记密码了?\n以下是验证码 \n${code}\n请勿将该邮件透露给其他任何人！\n如果你没有忘记密码，请忽略该邮件!`;

  try {
    await sendEmail({
      email: user.email,
      subject: '验证码-重置密码 (valid for 10 min)',
      message,
    });

    // 设置session和有效时间
    req.session.code = code;
    req.session.user_id = user.id;
    // 设置时间后销毁session
    setTimeout(() => {
      if (req.session) req.session.destroy();
    }, 60 * 60 * 1000);

    res.status(200).json({
      status: 'success',
      message: '验证码已经发送至邮箱!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('发送邮件出现了一个未知错误！请重试！!'), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.body.code)
    .digest('hex');

  if (!req.session.code) {
    return next(new AppError('验证码到期，请重新发送验证码!', 400));
  }

  // 这里要用user_id查找不然不同客户端的重复验证码可能会产生混乱
  const user = await User.findOne({ _id: req.session.user_id }).select(
    '+passwordResetToken'
  );

  // 验证码错误
  if (hashedToken !== user.passwordResetToken) {
    return next(new AppError('验证码错误！', 400));
  }

  // 密码相同则不修改
  if (user.password === req.body.password)
    return next(new AppError('不能修改为相同的密码！', 400));

  // 销毁session
  req.session.destroy();

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

// 更新密码
exports.updatePassword = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // 事实上前端就可以做这个校验
  const { oldPassword, password, passwordConfirm, id } = req.body;
  if (oldPassword === password)
    return next(new AppError('新密码与旧密码重复！请重新输入！'));
  // id是由前端传来的，前端登录了以后存了user state
  // 1) Get user from collection
  const user = await User.findById(id).select('+password');
  // 2) Check if posted current password is correct
  if (!(await user.correctPassword(oldPassword, user.password))) {
    return next(new AppError('输入的密码错误，请重新输入！', 401));
  }

  // 3) If so, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(id, 200, res);
});
