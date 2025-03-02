const router = require('express')();
const settingsController = require('../../controllers/settingsController');
const authMiddleware = require('../../middleware/authMiddleware');
const { hostMiddleware } = require('../../middleware/typeMiddleware');

router.get('/', settingsController.get);
router.post('/', authMiddleware, hostMiddleware, settingsController.set);

module.exports = router;