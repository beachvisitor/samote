module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') return next();
    if (!req.user?.auth && req.user?.type !== 'host') return res.status(401).end();
    next();
}