const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    // 标题
    title: {
      type: String,
      required: [true, '请输入标题'],
      trim: true,
      maxlength: [50, '超出最大标题限制，请修改后提交'],
    },
    // 博客分类（所属菜单）
    belongingMenu: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Menu',
    },
    // // 分类菜单名
    // menuTitle: {
    //   type: String,
    //   required: true,
    // },
    // // 分类菜单颜色
    // menuColor: {
    //   type: String,
    //   required: true,
    // },
    author: {
      type: String,
      required: [true, '博客需要有作者！'],
    },
    // 博客内容
    contents: {
      type: String,
      required: [true, '请输入博客内容'],
    },
    // 点赞数
    // likes: {
    //   type: Number,
    //   default: 0,
    // },
    // 浏览次数
    views: {
      type: Number,
      default: 0,
    },
    // 发布时间
    publishAt: {
      type: Date,
      default: Date.now(),
    },
    // 编辑时间
    updateAt: {
      type: Date,
      default: Date.now(),
    },
    // 博客属于哪个用户，唯一的不采用列表形式 (parent ref)
    belongTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual props
// 该博客的评论
blogSchema.virtual('comments', {
  ref: 'Comment', // 关联表
  foreignField: 'belongingBlog', // 外键
  localField: '_id', // 关联属性
});

// 中间件
blogSchema.pre(/^(find)/, function (next) {
  this.find({ active: { $ne: false } }).select('-__v'); // 不能添加和其他表有关联的属性
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
