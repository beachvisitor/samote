const ApiError = require('../error');

module.exports = (error, req, res, next) => {
    console.error(error);
    if (error instanceof ApiError) {
        return res.status(error.code || 500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'UNEXPECTED_ERROR' });
}