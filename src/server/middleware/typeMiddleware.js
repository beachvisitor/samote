const typeMiddleware = (type) => (req, res, next) => {
    if (req.method === 'OPTIONS') return next();
    if (req?.user?.type !== type) return res.status(403).end();
    next();
};

module.exports = {
    typeMiddleware,
    hostMiddleware: typeMiddleware('host'),
    clientMiddleware: typeMiddleware('client')
};
