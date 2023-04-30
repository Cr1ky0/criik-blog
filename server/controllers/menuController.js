const Menu = require('../models/menuModel');
const AppError = require('../utils/appError');
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
  const { title, icon, parentId, grade } = req.body;
  if (!title) return next(new AppError('请输入标题！', 400));
  if (!icon) return next(new AppError('请选择图标！', 400));
  const menu = await Menu.create({
    title: title,
    grade: grade,
    belongTo: req.user.id, // 受保护的路径使用req下的user
    belongingMenu: parentId,
    icon: icon,
    isParent: true,
  });

  res.status(201).json({
    status: 'success',
    body: {
      menu,
    },
  });
});

exports.deleteMenu = catchAsync(async (req, res, next) => {
  // 还需要将该菜单下的blog和menu删除
  await Menu.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateMenu = catchAsync(async (req, res, next) => {
  const { title, icon } = req.body;
  if (!title) return next(new AppError('请输入标题!', 400));
  if (!icon) return next(new AppError('请选择图标！', 400));
  await Menu.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    icon: req.body.icon,
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
