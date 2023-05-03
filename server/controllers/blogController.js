const Blog = require('../models/blogModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');

const myId = '64326421e387110cac9f8ece';

exports.defaultParams = (req, res, next) => {
  req.query.limit = '10';
  next();
};

exports.getBlog = catchAsync(async (req, res, next) => {
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
  const newBlog = await Blog.create({
    title,
    belongingMenu,
    contents,
    belongTo: req.user.id,
    author: req.user.name,
    publishAt: Date.now(),
  });

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

  res.status(200).json({
    status: 'success',
    data: {
      updatedBlog,
    },
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

exports.deleteBlog = catchAsync(async (req, res, next) => {
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
  const features = new APIFeatures(
    Blog.find({
      belongTo: myId,
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
  const blogs = await Blog.find({ belongTo: myId });
  const { length } = blogs;
  res.status(200).json({
    status: 'success',
    data: {
      length,
    },
  });
});

exports.getSelfTimeLine = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find({ belongTo: myId })
    .select('title publishAt id')
    .sort('-publishAt');

  res.status(200).json({
    status: '200',
    data: {
      timeLine: blogs,
    },
  });
});
