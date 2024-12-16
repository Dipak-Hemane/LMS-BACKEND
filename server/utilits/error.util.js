class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.contructor);
    }
}

export default AppError;