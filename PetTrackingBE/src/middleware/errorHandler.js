// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            message: 'Validation error',
            errors: err.errors.map(e => e.message)
        });
    }
    
    res.status(500).json({
        message: 'Something went wrong!'
    });
};

module.exports = errorHandler;