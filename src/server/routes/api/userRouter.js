const router = require('express')();
const userController = require('../../controllers/userController');
const authMiddleware = require('../../middleware/authMiddleware');
const { hostMiddleware, clientMiddleware } = require('../../middleware/typeMiddleware');

router.post('/auth', clientMiddleware, userController.auth);
router.post('/verify', authMiddleware, userController.verify);
router.post('/:id/modify', authMiddleware, hostMiddleware, userController.modify);

module.exports = router;