const router = require('express')();
const layoutsController = require('../../controllers/layoutsController');

router.get('/', layoutsController.get);

module.exports = router;