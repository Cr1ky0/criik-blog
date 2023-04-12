const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    commentController.addComment
  );

router.route('/:id').get(commentController.getComment);

module.exports = router;
