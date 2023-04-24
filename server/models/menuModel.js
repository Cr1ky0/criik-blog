const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    // 菜单标题
    title: {
      type: String,
      required: [true, '博客必须拥有标题'],
    },
    // 图标（对应前端的图标库）
    icon: {
      type: String,
      default: 'home',
    },
    // 删除标志
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    // 所属层级
    grade: {
      type: Number,
      default: 1,
    },
    // 所属用户 (Parent Ref)
    belongTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
