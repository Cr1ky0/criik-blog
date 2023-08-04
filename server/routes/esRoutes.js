const express = require('express');
const esController = require('../controllers/esController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(esController.searchDoc);

router.use(authController.protect, authController.restrictTo('admin'));

router
  .route('/')
  .post(esController.createBlogIndex)
  .patch(esController.initAllBlogsIndex);

module.exports = router;
