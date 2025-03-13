const ApiError = require('../error');

module.exports = (error, req, res, next) => {
    if (error instanceof ApiError) {
        return res.status(error.code || 500).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'UNEXPECTED_ERROR' });
}