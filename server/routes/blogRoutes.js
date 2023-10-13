const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

const router = express.Router();

// 获取我个人的博客信息（主页展示）
// router.get(
//   '/getSelfBlogs',
//   blogController.defaultParams,
//   blogController.getSelfBlogs
// );
router.get('/', blogController.defaultParams, blogController.getSelfBlogs);

// router.get('/blogs', blogController.defaultParams, blogController.getSelfBlogs);

// 获取总收藏数
// router.get('/getCollectedBlogNum', blogController.getCollectedBlogNum);
router.get('/collections', blogController.getCollectedBlogNum);

// 获取收藏博客
// router.get('/getCollectedBlog', blogController.getCollectedBlog);
router.get('/collected', blogController.getCollectedBlog);

// 获取我的博客数量
// router.get('/getSelfBlogNum', blogController.getSelfBlogNum);
router.get('/counts', blogController.getSelfBlogNum);

// 获取我的时间轴信息
// router.get('/getSelfTimeLine', blogController.getSelfTimeLine);
router.get('/timeline', blogController.getSelfTimeLine);

// 更新博客views
// router.patch('/updateViewOfBlog/:id', blogController.updateViewOfBlog);
router.patch('/update/view/:id', blogController.updateViewOfBlog);

// 更新博客点赞数
// router.patch('/updateLikesOfBlog/:id', blogController.updateLikesOfBlog);
router.patch('/update/like/:id', blogController.updateLikesOfBlog);

// 更新博客评论数
// router.patch('/plusCommentCount/:id', blogController.plusCommentCount);
router.patch('/update/comment/add/:id', blogController.plusCommentCount);
// router.patch('/decreaseCommentCount/:id', blogController.decreaseCommentCount);
router.patch(
  '/update/comment/decrease/:id',
  blogController.decreaseCommentCount
);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// reset sort
// router.patch('/resetAllSort', blogController.resetAllSort);
router.patch('/update/sort/reset', blogController.resetAllSort);

// 根据idList排序
// router.patch('/changeSort', blogController.changeSort);
router.patch('/update/sort/change', blogController.changeSort);

// 重置所有blogs的commentCount
// router.patch('/syncCommentCount', blogController.syncCommentCount);
router.patch('/update/comment/count/reset', blogController.syncCommentCount);

// 更新收藏状态
// router.patch('/updateCollectOfBlog/:id', blogController.updateCollectOfBlog);
router.patch('/update/collected/:id', blogController.updateCollectOfBlog);

// 更新博客所属菜单
// router.patch('/updateBelongOfBlog/:id', blogController.updateBelongMenu);
router.patch('/update/blog/:id', blogController.updateBelongMenu);

// 删除对应menu下的blogs（单层）
// router.delete('/delBlogsOfMenu/:blogId', blogController.deleteBlogOfMenu);
router.delete('/delete/blogs/:blogId', blogController.deleteBlogOfMenu);

// 获取有评论的博客
// router.get('/getBlogsWithComments', blogController.getBlogWithComments);
router.get('/comments', blogController.getBlogWithComments);

// 获取有评论的博客数量
// router.get(
//   '/getBlogsWithCommentsCount',
//   blogController.getBlogWithCommentsCount
// );
router.get('/counts/with/comments', blogController.getBlogWithCommentsCount);

router.route('/').post(blogController.addBlog); // 新建博客

router
  .route('/:id')
  // 获取指定博客
  // router.get('/getBlog/:id', blogController.getBlog);
  .get(blogController.getBlog) // 获取指定博客
  .patch(blogController.updateBlog) // 更新博客
  .delete(blogController.deleteBlog); // 删除博客

module.exports = router;
