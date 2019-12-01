const User = require('../model/user');
const { catchError, AppError } = require('../utils/error');
const { sendTokenConfig } = require('../utils/jwt');

module.exports.createUser = catchError(async (req, res, next) => { // 創建使用者
  try {
    const user = await User.create(req.body);
    res.status(201).send(user);
  } catch (error) {
    return next(new AppError(500, error));
  }
});

module.exports.userLogin = catchError(async (req, res, next) => { // 登入使用者
  try {
    const user = await User.findByCredential(req.body.email, req.body.password, next);
    sendTokenConfig(user, 200, res);
  } catch (error) {
    return next(new AppError(500, error));
  }
});