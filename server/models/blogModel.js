const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    // 标题
    title: {
      type: String,
      required: [true, '请输入标题'],
      trim: true,
      maxlength: [50, '超出最大标题限制，请修改后提交'],
      minlength: [8, '标题字数不够，请重新输入'],
    },
    // 博客分类
    classification: {
      type: String,
      required: true,
      default: ['Javascript', 'HTML', 'CSS'],
    },
    // 博客内容
    contents: {
      type: String,
      required: [true, '请输入博客内容'],
    },
    // 点赞数
    likes: {
      type: Number,
      default: 0,
    },
    // 发布时间
    publishAt: {
      type: Date,
      default: Date.now(),
    },
    // 博客属于哪个用户，唯一的不采用列表形式 (parent ref)
    belongTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
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

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
