const ApiError = require('../error');
const users = require('../users');
const settings = require('../settings');

class UserController {
    auth(req, res, next) {
        const { password } = req.body;
        settings.get()
            .then(data => {
                if (data.password !== password) return next(ApiError.bad());
                users.modify(req.id, {
                    auth: true,
                    access: {
                        view: req.user?.access?.view || true,
                        touch: req.user?.access?.touch || true,
                        keyboard: req.user?.access?.keyboard || true
                    }
                });
                res.end();
            })
            .catch(() => next(ApiError.internal()));
    }

    verify(req, res) {
        users.modify(req.id, { auth: true });
        res.end();
    }

    modify(req, res) {
        users.modify(req.params.id, req.body);
        res.end();
    }
}

module.exports = new UserController();