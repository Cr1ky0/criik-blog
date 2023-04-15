const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    // 菜单标题
    title: {
      type: String,
      required: [true, '博客必须拥有标题'],
    },
    // 是否为母菜单
    isParent: {
      type: String,
      default: true,
    },
    // 删除标志
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    // 所属父菜单 (Parent ref)
    parentMenu: {
      type: mongoose.Schema.ObjectId,
      ref: 'Menu',
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

// 该menu的childMenu
menuSchema.virtual('childMenus', {
  ref: 'Menu',
  foreignField: 'parentMenu',
  localField: '_id',
});

menuSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } }).populate({
    path: 'childMenus',
    select: '-__v',
  });
  next();
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
