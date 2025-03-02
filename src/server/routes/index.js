const router = require('express')();
const apiRouter = require('./api');
const liveRouter = require('./live');
const authMiddleware = require('../middleware/authMiddleware');
const userMiddleware = require('../middleware/userMiddleware');

router.use('/api', userMiddleware, apiRouter);
router.use('/live', userMiddleware, authMiddleware, liveRouter);

module.exports = router;