const express = require('express');
const OSSPolicyController = require('../controllers/OSSPolicyController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'));
router.get('/getConfig', OSSPolicyController.getConfig);
router.post('/setConfig', OSSPolicyController.setConfig);
// policy

router.get('/', OSSPolicyController.getPolicy);
router.post('/result', OSSPolicyController.getResult);

module.exports = router;
