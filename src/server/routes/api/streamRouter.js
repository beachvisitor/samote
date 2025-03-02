const router = require('express')();
const streamController = require('../../controllers/streamController');
const authMiddleware = require('../../middleware/authMiddleware');
const { hostMiddleware } = require('../../middleware/typeMiddleware');

router.post('/start', authMiddleware, hostMiddleware, streamController.start);
router.post('/stop', authMiddleware, hostMiddleware, streamController.stop);
router.post('/reload', authMiddleware, hostMiddleware, streamController.reload);

module.exports = router;