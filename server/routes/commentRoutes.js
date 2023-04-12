const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// 添加评论
router.route('/').post(authController.protect, commentController.addComment);

router
  .route('/:id')
  .get(commentController.getComment) // 根据id获取评论（测试用）
  .patch(authController.protect, commentController.updateComment) // 更新评论
  .delete(authController.protect, commentController.deleteComment); // 删除评论

module.exports = router;
