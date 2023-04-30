const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

// const router = express.Router({ mergeParams: true });

const router = express.Router();

// 统计评论数
router.get('/getCommentsNum/:blogId', commentController.getCommentNum);

// 添加评论
router.route('/').post(commentController.addComment);

// router.get('/getCommentsOfBlog', commentController.getCommentsOfBlog);

router
  .route('/:id')
  .get(commentController.defaultParams, commentController.getCommentsOfBlog)
  .patch(authController.protect, commentController.updateComment) // 更新评论
  .delete(authController.protect, commentController.deleteComment); // 删除评论

module.exports = router;
