const ApiError = require('../error');
const layouts = require('../../layouts');

class LayoutsController {
    get(req, res, next) {
        layouts.get()
            .then((data) => res.json(data))
            .catch(() => next(ApiError.internal()));
    }
}

module.exports = new LayoutsController();