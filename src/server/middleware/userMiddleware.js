const users = require('../users');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') return next();
    const id = req.headers.authorization?.split(' ')[1];
    const user = users.get(id);
    if (!id || !user) return res.status(401).end();
    req.id = id;
    req.user = user;
    next();
}