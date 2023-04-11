const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

// 获取所有blog（进行了filter等操作可分页）
router.route('/').get(blogController.getAllBlogs);

// 对当前用户博客进行操作
router.route('/:userId').post(blogController.addBlog);
module.exports = router;
