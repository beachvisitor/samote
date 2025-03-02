const router = require('express')();
const languagesController = require('../../controllers/languagesController');

router.get('/', languagesController.get);

module.exports = router;