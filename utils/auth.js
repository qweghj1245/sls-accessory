const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { catchError, AppError } = require('./error');

module.exports.auth = catchError(async (req, res, next) => { // Authorization
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
  if (!user) return next(new AppError(404, 'Authorization is wrong'));

  req.token = token;
  req.user = user;
  next();
});

module.exports.restrictTo = (...roles) => { // 身份驗證
  return (req, res, next) => {
    if (!roles.includes(req.user.identity)) {
      return next(new AppError(403, 'Permission failed!'));
    }
    next();
  }
}