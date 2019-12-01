module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  console.log(err);
  if (process.env.STAGE == 'dev') {
    res.status(err.statusCode).send({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.STAGE == 'prod') {
    if (err.isOperational) {
      res.status(err.statusCode).send({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(err.statusCode).send({
        status: 500,
        message: 'Something get wrong',
      });
    }
  }
};