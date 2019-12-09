const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../model/user');
const { catchError, AppError } = require('../utils/error');
const { sendTokenConfig } = require('../utils/jwt');
const { sendResetEmail } = require('../utils/email');

module.exports.createUser = catchError(async (req, res, next) => { // 創建使用者
  try {
    const findIfRegistered = await User.findOne({ email: req.body.email, userSource: 'google' });
    if (findIfRegistered) return next(new AppError(403, 'You already have registered by google!'));
    const user = await User.create(req.body);
    sendTokenConfig(user, 201, res);
  } catch (error) {
    return next(new AppError(500, error));
  }
});

module.exports.getUser = catchError(async (req, res) => { // 取得 使用者
  res.status(200).send(req.user);
});

module.exports.updateUser = catchError(async (req, res, next) => { // 更新使用者資訊
  const key = ['name', 'photo', 'address', 'phoneNumber'];
  const reqKey = Object.keys(req.body);
  const includesType = reqKey.every(d => key.includes(d));
  if (!includesType) return next(500, 'Your request body cannot pass');
  try {
    reqKey.forEach(d => {
      req.user[d] = req.body[d];
    });
    await req.user.save();
    res.status(200).send(req.user);
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

module.exports.userLogout = catchError(async (req, res, next) => { // 登出使用者
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.status(200).send({ status: 'success!' });
  } catch (error) {
    return next(new AppError(500, error));
  }
});

module.exports.userLogoutAll = catchError(async (req, res, next) => { // 登出所有使用者
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send({ status: 'success!' });
  } catch (error) {
    return next(new AppError(500, error));
  }
});

module.exports.changePassword = catchError(async (req, res, next) => { // 更新密碼
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError(500, 'Server Error'));
  const verifyPassword = await bcrypt.compare(req.body.oldPassword, user.password);
  console.log(verifyPassword);
  if (!verifyPassword) return next(new AppError(500, 'Password is not correct'));
  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  sendTokenConfig(user, 200, res);
});

module.exports.forgetPassword = catchError(async (req, res, next) => { // 忘記密碼 1.送email認證信包裹token
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError(404, 'User is not defined'));
  const resetToken = user.createResetPasswordToken();
  await user.save();

  // console.log(req.protocol, req.get('host'));

  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/resetToken/${resetToken}`; // 要再替換，還沒決定前端路由和內容QAQ
    const message = `Forget your password, please enter this url ${resetUrl}`;
    sendResetEmail(req.body.email, message);
    res.status(200).send({ message: 'Token send to email' });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(new AppError(500, 'cannot send email'));
  }
});

module.exports.resetPassword = catchError(async (req, res, next) => { // 忘記密碼 2.更新密碼
  const compareToken = crypto.createHash('sha256').update(req.body.id).digest('hex');
  const user = await User.findOne({ passwordResetToken: compareToken, passwordResetExpires: { $gt: Date.now() } });
  if (!user) return next(new AppError(400, 'Invalid Token or OverTime'));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  sendTokenConfig(user, 200, res);
});

module.exports.getIdentifiedUser = catchError(async (req, res, next) => { // 取得身份所有使用者（含搜尋）
  if (!req.body.identity) {
    return next(500, 'You cant do this operate!');
  }

  const searchConfig = {
    identity: req.body.identity,
  };
  if (req.body.name) {
    searchConfig.name = req.body.name;
  }
  const userList = await User.find(searchConfig);
  res.status(200).send(userList);
});

module.exports.googleSignInProcess = catchError(async (req, res, next) => { // google 登入
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: req.body.token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { name, email, picture, email_verified } = payload;
  const findIfRegistered = await User.findOne({ email });
  if (findIfRegistered && findIfRegistered.userSource == 'local') {
    return next(new AppError(403, 'You already have registered by locally!'));
  } else if (findIfRegistered && findIfRegistered.userSource == 'google') {
    return sendTokenConfig(findIfRegistered, 201, res);
  }
  if (!email_verified) return next(new AppError(403, 'Please verify your email account!'));
  const user = await User.create({
    name,
    email,
    photo: picture,
    userSource: 'google',
  });
  sendTokenConfig(user, 201, res);
});