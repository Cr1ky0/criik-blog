const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');
const commentRoutes = require('./commentRoutes');

const router = express.Router();

router.use('/:blogId/comments', commentRoutes);

// 获取所有blog（进行了filter等操作可分页）
router
  .route('/getAllBlogs')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    blogController.getAllBlogs
  );

router
  .route('/')
  .get(authController.protect, blogController.getBlogs) // 获取当前用户所有blogs
  .post(authController.protect, blogController.addBlog); // 新建博客

router
  .route('/:id')
  .get(blogController.getBlog) // 获取博客
  .patch(authController.protect, blogController.updateBlog) // 更新博客
  .delete(authController.protect, blogController.deleteBlog); // 删除博客
module.exports = router;
