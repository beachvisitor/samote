const ApiError = require('../error');
const settings = require('../../settings');

class SettingsController {
    get(req, res, next) {
        settings.get()
            .then((data) => {
                data.default = settings.default;
                const { language, theme } = data;
                if (req.user.type !== 'host') data = { language, theme };
                res.json(data);
            })
            .catch(() => next(ApiError.internal()));
    }

    set(req, res, next) {
        if (req.user.type !== 'host') return next(ApiError.forbidden());
        settings.set(req.body)
            .then(() => res.end())
            .catch(() => next(ApiError.internal()));
    }
}

module.exports = new SettingsController();