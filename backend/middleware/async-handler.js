
// this middleware is used to handle async errors
// without having to write try/catch blocks in every route handler

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
