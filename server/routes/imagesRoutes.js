const express = require('express');
const imageController = require('../controllers/imageController');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/photos', imageController.getPhotos);

// 权限设置
router.use(authController.protect, authController.restrictTo('admin'));
// router.get('/getSelfPhotos', imageController.getSelfPhotos);
router.get('/self/photos', imageController.getSelfPhotos);
// router.delete('/delMany', imageController.delMany);
router.delete('/delete/many', imageController.delMany);
// router.get('/getCount', imageController.getCount);
router.get('/counts', imageController.getCount);

router
  .route('/')
  .post(imageController.addPhotos)
  .patch(imageController.updateClass)
  .delete(imageController.delSingle);

module.exports = router;
