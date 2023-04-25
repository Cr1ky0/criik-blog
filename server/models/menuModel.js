const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    // 菜单标题
    title: {
      type: String,
      required: [true, '博客必须拥有标题'],
    },
    // 图标（对应前端的图标库）
    icon: String,
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
    // // 是否是菜单（非博客）
    // isParent: {
    //   type: Boolean,
    //   default: true,
    // },
    // 所属父菜单
    belongingMenu: {
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

// 子菜单
menuSchema.virtual('children', {
  ref: 'Menu',
  foreignField: 'belongingMenu',
  localField: '_id',
});

menuSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } })
    .populate({ path: 'children' })
    .select('-__v -belongTo');
  next();
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
