const Menu = require('../models/menuModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.getMenus = catchAsync(async (req, res, next) => {
  const menus = await Menu.find();
  res.status(200).json({
    status: 'success',
    body: {
      menus,
    },
  });
});

exports.getMenusOfUser = catchAsync(async (req, res, next) => {
  // 过滤一下已经populate的子menu
  const menus = await Menu.find({ belongTo: req.user.id, grade: 1 }).select(
    '-__v -belongTo'
  );
  res.status(200).json({
    status: 'success',
    body: {
      menus,
    },
  });
});

exports.addMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.create({
    title: req.body.title,
    grade: req.body.grade,
    belongTo: req.user.id, // 受保护的路径使用req下的user
    belongingMenu: req.body.parentId,
    icon: req.body.icon,
    isParent: true,
  });

  res.status(201).json({
    status: 'success',
    body: {
      menu,
    },
  });
});

exports.addBlogMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.create({
    title: req.body.title,
    grade: 3,
    belongTo: req.user.id, // 受保护的路径使用req下的user
    belongingMenu: req.body.parentId,
    isParent: false,
  });

  res.status(201).json({
    status: 'success',
    body: {
      menu,
    },
  });
});

exports.deleteMenu = catchAsync(async (req, res, next) => {
  await Menu.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
