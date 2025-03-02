class ApiError extends Error {
    code;
    message;

    constructor(code, message) {
        super();
        this.code = code;
        this.message = message;
    }

    static bad(message = 'BAD_REQUEST') {
        return new ApiError(400, message);
    }

    static unauthorized(message = 'UNAUTHORIZED') {
        return new ApiError(401, message);
    }

    static forbidden(message = 'FORBIDDEN') {
        return new ApiError(403, message);
    }

    static internal(message = 'INTERNAL_SERVER_ERROR') {
        return new ApiError(500, message);
    }
}

module.exports = ApiError;