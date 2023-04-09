const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const generateCode = require('../utils/generateCode');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name不能为空!'],
  },
  email: {
    type: String,
    required: [true, '请输入邮箱地址!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, '请提供有效的邮箱地址!'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'visitor', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, '请输入密码！'],
    minlength: 6,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, '请确认你的密码！'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: '两次密码不一样!',
    },
  },
  // 密码最近更新时间
  passwordChangedAt: Date,
  // 密码重置token
  passwordResetToken: {
    type: String,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  // 修改了才进行否则next()
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12); // 异步，不阻止其他操作

  // 清除重复确认字段
  this.passwordConfirm = undefined;
  next();
});

// 修改密码或刚创建用户后将passwordChangedAt更新
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // 密码保存到数据库比发出JWT要慢一点,让时间戳相较JWT会滞后一些，所以减1s
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({
    active: { $ne: false },
  }).select('-passwordChangedAt -__v'); // select进一步筛选
  next();
});

// 验证password是否正确
// 向userSchema中添加方法
// 使用时直接user.correctPassword
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // this.password不可用所以逻辑在controller中进行
  return await bcrypt.compare(candidatePassword, userPassword);
};

// 检测用户是否更新了密码
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // 数据库对象转化为时间戳
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

// 重置密码的token
userSchema.methods.createPasswordResetToken = function () {
  // 生成6位验证码
  const code = generateCode(6);

  // 数据库中创建根据上面token生成的加密token字段
  // 这个字段无法反向解析，所以存在数据库中是可以的
  // 对比时将token的在controller中按下面这样的再转化一下对比就行
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(code)
    .digest('hex');

  return code;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
