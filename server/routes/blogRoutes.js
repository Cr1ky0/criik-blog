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
router.get('/getSelfBlogNum', blogController.getSelfBlogNum);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));
// 获取所有blog（进行了filter等操作可分页）
router.route('/getAllBlogs').get(blogController.getAllBlogs);

// 删除对应menu下的blogs（单层）
router.delete('/delBlogsOfMenu/:blogId', blogController.deleteBlogOfMenu);

router
  .route('/')
  .get(blogController.getBlogs) // 获取当前用户所有blogs
  .post(blogController.addBlog); // 新建博客

router
  .route('/:id')
  .get(blogController.getBlog) // 获取博客
  .patch(blogController.updateBlog) // 更新博客
  .delete(blogController.deleteBlog); // 删除博客
module.exports = router;
