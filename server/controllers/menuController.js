const Menu = require('../models/menuModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');
const User = require('../models/userModel');

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
