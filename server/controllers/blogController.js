const Blog = require('../models/blogModel');
const Menu = require('../models/menuModel');
const User = require('../models/userModel');
const client = require('../models/esModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');

exports.defaultParams = (req, res, next) => {
  req.query.limit = '10';
  next();
};

// 重置所有blog的sort值
exports.resetAllSort = catchAsync(async (req, res) => {
  for (let j = 1; j <= 3; j += 1) {
    Menu.find({ grade: j }).then((menus) => {
      for (let i = 0; i < menus.length; i += 1) {
        Blog.find({ belongingMenu: menus[i].id })
          .select('-contents')
          .sort({ publishAt: 1 })
          .then((data) => {
            data.forEach((blog, index) => {
              blog.sort = index;
              blog.save();
            });
          });
      }
    });
  }
  res.status(200).json({
    status: 'success',
    data: {},
  });
});

// 根据idList排序
exports.changeSort = catchAsync(async (req, res, next) => {
  const { idList } = req.body;
  // eslint-disable-next-line array-callback-return
  idList.map((id, index) => {
    Blog.findByIdAndUpdate(id, { sort: index }).then(
      () => new Promise(() => {})
    );
  });

  res.status(200).json({
    status: 'success',
    data: {},
  });
});

exports.getBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

exports.addBlog = catchAsync(async (req, res, next) => {
  const { title, belongingMenu, contents } = req.body;
  if (!belongingMenu) return next(new AppError('请选择分类！', 400));
  if (!title || !contents) return next(new AppError('请输入标题和内容！', 400));
  const maxSort = await Blog.find({ belongingMenu: belongingMenu })
    .sort({ sort: -1 })
    .select('_id sort')
    .limit(1);
  const newBlog = await Blog.create({
    title,
    belongingMenu,
    contents,
    belongTo: req.user.id,
    author: req.user.name,
    sort: maxSort[0] ? maxSort[0].sort + 1 : 0,
    publishAt: Date.now(),
  });

  // 添加es文档
  const doc = await client.index({
    index: 'blogs',
    body: {
      blog_id: newBlog.id,
      title: title,
      content: contents.replace(/\n/g, ''), // 去除所有换行符
      belong_menu_id: belongingMenu,
    },
  });

  // 保存文档id
  newBlog.es_doc_id = doc._id;
  await newBlog.save();

  res.status(201).json({
    status: 'success',
    data: {
      newBlog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'contents',
    'belongingMenu',
    'title',
    'updateAt'
  );
  const { title, belongingMenu, contents } = req.body;
  if (!belongingMenu) return next(new AppError('请选择分类！', 400));
  if (!title || !contents) return next(new AppError('请输入标题和内容！', 400));
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  // 更新es doc
  await client.update({
    index: 'blogs',
    id: updatedBlog.es_doc_id,
    body: {
      doc: { title: title, content: contents, belong_menu_id: belongingMenu },
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedBlog,
    },
  });
});

exports.plusCommentCount = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  blog.commentCount += 1;
  await blog.save();

  res.status(200).json({
    status: 'success',
    data: {},
  });
});

exports.decreaseCommentCount = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  blog.commentCount -= 1;
  await blog.save();

  res.status(200).json({
    status: 'success',
    data: {},
  });
});

exports.updateViewOfBlog = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'views');
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      updatedBlog,
    },
  });
});

exports.updateCollectOfBlog = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'isCollected');
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      updatedBlog,
    },
  });
});

exports.updateLikesOfBlog = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'likes');
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      updatedBlog,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  // 删除blog文档
  await client.delete({
    index: 'blogs',
    id: blog.es_doc_id,
  });

  await Blog.findByIdAndUpdate(req.params.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteBlogOfMenu = catchAsync(async (req, res, next) => {
  await Blog.updateMany(
    { belongingMenu: req.params.blogId },
    { active: false }
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getSelfBlogs = catchAsync(async (req, res, next) => {
  const id = await User.getAdminUserId();
  const features = new APIFeatures(
    Blog.find({
      belongTo: id,
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const blogs = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      blogs,
    },
  });
});

exports.getSelfBlogNum = catchAsync(async (req, res, next) => {
  const id = await User.getAdminUserId();
  const blogs = await Blog.find({ belongTo: id });
  const { length } = blogs;
  res.status(200).json({
    status: 'success',
    data: {
      length,
    },
  });
});

exports.getSelfTimeLine = catchAsync(async (req, res, next) => {
  const id = await User.getAdminUserId();
  const blogs = await Blog.find({ belongTo: id })
    .select('title publishAt id')
    .sort('-publishAt');

  res.status(200).json({
    status: 'success',
    data: {
      timeLine: blogs,
    },
  });
});

exports.getBlogWithComments = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Blog.find({ commentCount: { $gt: 0 } }).populate('comments'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const blogs = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      blogs,
    },
  });
});

exports.getBlogWithCommentsCount = catchAsync(async (req, res) => {
  const count = await Blog.count({ commentCount: { $gt: 0 } });

  res.status(200).json({
    status: 'success',
    data: {
      count,
    },
  });
});

// 更新所有blog的commentCount为当前comments的长度
exports.syncCommentCount = catchAsync(async (req, res) => {
  const blogs = await Blog.find().populate('comments');

  blogs.forEach((blog) => {
    blog.commentCount = blog.comments.length;
    blog.save();
  });

  res.status(200).json({
    status: 'success',
    data: {},
  });
});

exports.getCollectedBlogNum = catchAsync(async (req, res) => {
  const count = await Blog.count({ isCollected: true });

  res.status(200).json({
    status: 'success',
    data: {
      count,
    },
  });
});

exports.getCollectedBlog = catchAsync(async (req, res) => {
  const blogs = await Blog.find({ isCollected: true })
    .select('id title')
    .sort('-_id');

  res.status(200).json({
    status: 'success',
    data: blogs,
  });
});

exports.updateBelongMenu = catchAsync(async (req, res) => {
  const filteredBody = filterObj(req.body, 'belongingMenu', 'updateAt');
  const { belongingMenu } = req.body;
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  // 更新es doc
  await client.update({
    index: 'blogs',
    id: updatedBlog.es_doc_id,
    body: {
      doc: { belong_menu_id: belongingMenu },
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedBlog,
    },
  });
});
