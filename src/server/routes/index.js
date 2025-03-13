const router = require('express')();
const apiRouter = require('./api');
const userMiddleware = require('../middleware/userMiddleware');

router.use('/api', userMiddleware, apiRouter);

module.exports = router;