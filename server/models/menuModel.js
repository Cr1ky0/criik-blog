const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    // 菜单标题
    title: {
      type: String,
      required: [true, '博客必须拥有标题'],
      maxlength: [50, '超出最大标题限制，请修改后提交'],
    },
    // 图标（对应前端的图标库）
    icon: String,
    // 删除标志
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    // 标签颜色
    color: {
      type: String,
      defualt: 'cyan',
    },
    // 所属层级
    grade: {
      type: Number,
      default: 1,
    },
    // 当前菜单排序
    sort: {
      type: Number,
    },
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
    // 创建时间
    createAt: {
      type: Date,
      default: Date.now(),
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

// 归属的博客
menuSchema.virtual('blogs', {
  ref: 'Blog',
  foreignField: 'belongingMenu',
  localField: '_id',
});

menuSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } })
    // .populate({ path: 'children' })
    // .populate('blogs', '-contents -belongTo -likes -views')
    .select('-__v -belongTo');
  next();
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
