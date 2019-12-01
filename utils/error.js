module.exports.AppError = class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('5') ? 'error' : 'fail';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports.catchError = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};