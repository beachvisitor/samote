const ApiError = require('../error');
const languages = require('../../languages');

class LanguagesController {
    get(req, res, next) {
        languages.get()
            .then((data) => res.json(data))
            .catch(() => next(ApiError.internal()));
    }
}

module.exports = new LanguagesController();