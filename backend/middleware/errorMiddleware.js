
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // pass error to error handler
}

const errorHandler = (err, req, res, next) => {
    let status = res.statusCode ? (res.statusCode === 200 ? 500 : res.statusCode) : 500;
    let message = err.message ? err.message : 'Internal Server Error!';

    // Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        status = 404;
        message = 'Resource not found!';
    }

    return res.status(status).json({
        message,
    });
}

export { notFound, errorHandler };
