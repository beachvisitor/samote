const router = require('express')();
const streamRouter = require('./streamRouter');
const settingsRouter = require('./settingsRouter');
const languagesRouter = require('./languagesRouter');
const layoutsRouter = require('./layoutsRouter');
const userRouter = require('./userRouter');

router.use('/stream', streamRouter);
router.use('/settings', settingsRouter);
router.use('/languages', languagesRouter);
router.use('/layouts', layoutsRouter);
router.use('/user', userRouter);

module.exports = router;