const Menu = require('../models/menuModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');
const User = require('../models/userModel');
const { getMaxDepth } = require('../utils/utils');

// 初始化menu的createAt字段
exports.initCreateAtOfMenu = catchAsync(async (req, res) => {
  await Menu.updateMany({}, { createAt: Date.now() });
  res.status(200).json({
    status: 'success',
    data: {},
  });
});

// 初始化menu的sort字段
exports.initSortOfMenus = catchAsync(async (req, res) => {
  Menu.find({ grade: 1 })
    .sort({ createAt: 1 })
    .then((result) => {
      result.map((obj, index) => {
        obj.sort = index;
        obj.save();
        // 二级菜单处理
        Menu.find({ belongingMenu: obj.id })
          .sort({ createAt: 1 })
          .then((secMenus) => {
            secMenus.map((secObj, secIndex) => {
              secObj.sort = secIndex;
              secObj.save();
              // 三级菜单处理
              Menu.find({ belongingMenu: secObj.id })
                .sort({ createAt: 1 })
                .then((thiMenus) => {
                  thiMenus.map((thiObj, thiIndex) => {
                    thiObj.sort = thiIndex;
                    thiObj.save();
                    return null;
                  });
                });
              return null;
            });
          });
        return null;
      });
    });

  res.status(200).json({
    status: 'success',
    data: {},
  });
});

// 前端传回一个id数组，根据id数组顺序修改相应id的sort字段
exports.changeSort = catchAsync(async (req, res, next) => {
  const { idList } = req.body;
  // eslint-disable-next-line array-callback-return
  idList.map((id, index) => {
    Menu.findByIdAndUpdate(id, { sort: index }).then(
      () => new Promise(() => {})
    );
  });

  res.status(200).json({
    status: 'success',
    data: {},
  });
});

exports.getMenus = catchAsync(async (req, res, next) => {
  const menus = await Menu.find();
  res.status(200).json({
    status: 'success',
    body: {
      menus,
    },
  });
});

exports.getMenuById = catchAsync(async (req, res) => {
  const menu = await Menu.findById(req.params.id)
    .populate({
      path: 'children',
    })
    .populate('blogs', '-contents -belongTo -likes -views');

  res.status(200).json({
    status: 'success',
    data: {
      menu,
    },
  });
});

exports.getMenusOfUser = catchAsync(async (req, res, next) => {
  // 过滤一下已经populate的子menu
  const menus = await Menu.find({ belongTo: req.params.id, grade: 1 });
  res.status(200).json({
    status: 'success',
    body: {
      menus,
    },
  });
});

exports.addMenu = catchAsync(async (req, res, next) => {
  const { title, icon, parentId, grade, color } = req.body;
  if (!title) return next(new AppError('请输入标题！', 400));
  if (!icon) return next(new AppError('请选择图标！', 400));
  if (!color) return next(new AppError('请选择标签颜色！', 400));
  const maxSort = await Menu.find({ belongingMenu: parentId })
    .sort({ sort: -1 })
    .select('_id sort')
    .limit(1);
  const menu = await Menu.create({
    title: title,
    grade: grade,
    belongTo: req.user.id, // 受保护的路径使用req下的user
    belongingMenu: parentId,
    color,
    icon: icon,
    sort: maxSort[0] ? maxSort[0].sort + 1 : 0,
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

exports.updateMenu = catchAsync(async (req, res) => {
  const filteredBody = filterObj(req.body, 'color', 'icon', 'title');
  await Menu.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getSelfMenu = catchAsync(async (req, res, next) => {
  const id = await User.getAdminUserId();
  const menus = await Menu.find({ belongTo: id, grade: 1 })
    .populate({
      path: 'children',
      options: { sort: 'sort' },
      populate: [
        {
          path: 'children',
          options: { sort: 'sort' },
          populate: [
            { path: 'children' },
            {
              path: 'blogs',
              select: '-contents -belongTo -likes -views',
              options: { sort: 'sort' },
            },
          ],
        },
        {
          path: 'blogs',
          select: '-contents -belongTo -likes -views',
          options: { sort: 'sort' },
        },
      ],
    })
    .populate({
      path: 'blogs',
      select: '-contents -belongTo -likes -views',
      options: { sort: 'sort' },
    })
    .sort('sort');
  res.status(200).json({
    status: 'success',
    body: {
      menus,
    },
  });
});

exports.updateBelong = catchAsync(async (req, res, next) => {
  const { isMain, belongingMenu } = req.body;
  const filteredBody = filterObj(req.body, 'belongingMenu');
  const self = await Menu.findById(req.params.id).populate({
    path: 'children',
    populate: [
      {
        path: 'children',
        populate: [{ path: 'children' }],
      },
    ],
  });
  // 不能修改为自身
  if (belongingMenu === req.params.id) {
    return next(new AppError('不能修改为自身!', 403));
  }

  if (belongingMenu !== '主菜单') {
    // 不能修改为grade=3的
    const belong = await Menu.findById(belongingMenu).populate({
      path: 'children',
      populate: [
        {
          path: 'children',
          populate: [{ path: 'children' }],
        },
      ],
    });
    if (belong.grade === 3)
      return next(new AppError('不能修改为最底层菜单的子菜单！', 403));

    // 不能修改为自身的后代
    const { children } = self;
    let isChild = false;
    children.forEach((child) => {
      if (child.id === belongingMenu) isChild = true;
      child.children.forEach((grand) => {
        if (grand.id === belongingMenu) isChild = true;
      });
    });
    if (isChild) return next(new AppError('不能修改为自身的后代', 403));

    // 当前菜单深度与目标菜单深度之和超出限制则不能修改
    const selfDepth = getMaxDepth(self);
    if (belong.grade === 2 && selfDepth > 1) {
      return next(new AppError('最大深度限制3，无法移动！', 403));
    }
    if (belong.grade === 1 && selfDepth > 2)
      return next(new AppError('最大深度限制3，无法移动！', 403));
  }

  // change sort && filter
  if (self.belongingMenu !== belongingMenu) {
    if (isMain) {
      const main = await Menu.find({ grade: 1 });
      // 去掉belongingMenu
      filteredBody.belongingMenu = undefined;
      self.belongingMenu = undefined;
      filteredBody.grade = 1;
      self.sort = main.length;
    } else {
      const belong = await Menu.findById(belongingMenu);
      filteredBody.grade = belong.grade + 1;
      self.sort = belong.length;
    }
    self.save();
  }

  // update
  const newMenu = await Menu.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      newMenu,
    },
  });
});
