const ApiError = require('../error');
const stream = require('../stream');

const handle = (func) => async (req, res, next) => {
    try {
        await func();
        res.end();
    } catch (e) {
        next(ApiError.internal());
    }
}

class StreamController {
    start = handle(stream.start.bind(stream));
    stop = handle(stream.stop.bind(stream));
    reload = handle(stream.reload.bind(stream));
}

module.exports = new StreamController();