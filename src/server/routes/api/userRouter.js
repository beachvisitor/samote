const router = require('express')();
const userController = require('../../controllers/userController');
const authMiddleware = require('../../middleware/authMiddleware');
const { hostMiddleware, clientMiddleware } = require('../../middleware/typeMiddleware');
const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5
});

router.post('/auth', limiter, clientMiddleware, userController.auth);
router.post('/verify', authMiddleware, userController.verify);
router.post('/:id/modify', authMiddleware, hostMiddleware, userController.modify);

module.exports = router;