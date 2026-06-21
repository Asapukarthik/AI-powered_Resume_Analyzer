export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    // Graceful Multer Error Handling
    if (err.name === 'MulterError') {
        statusCode = 400; // Bad Request
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File size exceeds the 5MB limit. Please upload a smaller document.';
        }
    }
    res.status(statusCode);
    res.json({
        error: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
