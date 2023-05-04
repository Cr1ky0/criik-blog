const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

const router = express.Router();

// 获取我个人的博客信息（主页展示）
router.get(
  '/getSelfBlogs',
  blogController.defaultParams,
  blogController.getSelfBlogs
);

// 获取我的博客数量
router.get('/getSelfBlogNum', blogController.getSelfBlogNum);

// 获取我的时间轴信息
router.get('/getSelfTimeLine', blogController.getSelfTimeLine);

// 更新博客views
router.patch('/updateViewOfBlog/:id', blogController.updateViewOfBlog);

// 更新博客点赞数
router.patch('/updateLikesOfBlog/:id', blogController.updateLikesOfBlog);

// 获取指定博客
router.route('/:id').get(blogController.getBlog);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// 更新收藏状态
router.patch('/updateCollectOfBlog/:id', blogController.updateCollectOfBlog);

// 删除对应menu下的blogs（单层）
router.delete('/delBlogsOfMenu/:blogId', blogController.deleteBlogOfMenu);

router.route('/').post(blogController.addBlog); // 新建博客

router
  .route('/:id')
  .patch(blogController.updateBlog) // 更新博客
  .delete(blogController.deleteBlog); // 删除博客
module.exports = router;
