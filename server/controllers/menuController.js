const Menu = require('../models/menuModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.getMenus = catchAsync(async (req, res, next) => {
  const menus = await Menu.find();
  // .populate({ path: 'childMenus', select: '-__v -belongTO' })
  // .select('-__v -belongTo');

  res.status(200).json({
    status: 'success',
    body: {
      menus,
    },
  });
});

exports.getMenusOfUser = catchAsync(async (req, res, next) => {
  // 过滤一下已经populate的子menu
  const menus = await Menu.find({ belongTo: req.user.id })
    .where('isParent')
    .equals(true)
    .select('-__v -belongTo');
  res.status(200).json({
    status: 'success',
    body: {
      menus,
    },
  });
});

exports.addParentMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.create({
    title: req.body.title,
    belongTo: req.user.id, // 受保护的路径使用req下的user
  });

  res.status(201).json({
    status: 'success',
    body: {
      menu,
    },
  });
});

exports.addChildMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.create({
    title: req.body.title,
    isParent: false,
    parentMenu: req.body.parentMenuId,
    belongTo: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    body: {
      menu,
    },
  });
});
