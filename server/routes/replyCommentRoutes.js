const express = require('express');
const replyCommentController = require('../controllers/replyCommentController');
const authController = require('../controllers/authController');

const router = express.Router();

// 回复评论
router.route('/').post(replyCommentController.addReply);

// 更新likes
router.route('/:id').patch(replyCommentController.updateComment);

// del
router.use(authController.protect, authController.restrictTo('admin'));
router.route('/:id').delete(replyCommentController.deleteComment);

module.exports = router;
