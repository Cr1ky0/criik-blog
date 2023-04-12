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
  .get(authController.protect, blogController.getBlogs)
  .post(authController.protect, blogController.addBlog);

// 根据博客id做操作
router.route('/:id').get(blogController.getBlog);
module.exports = router;
