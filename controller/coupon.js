const Coupon = require('../model/coupon');
const Cart = require('../model/cart');
const { catchError, AppError } = require('../utils/error');
const { generateCode } = require('../utils/randomCode');
module.exports.createCoupon = catchError(async (req, res, next) => { // 創建優惠卷
  const keys = ['state', 'couponCode'];
  const reqKeys = Object.keys(req.body);
  const checkKey = keys.some(d => reqKeys.includes(d));
  if (checkKey) return next(new AppError(400, 'Invalid value'));

  const code = generateCode(8);
  const coupon = new Coupon({
    ...req.body,
    couponCode: code,
    createUser: req.user._id,
  });
  await coupon.save();
  res.status(201).send(coupon);
});

module.exports.getCoupons = catchError(async (req, res, next) => { // 取得所有優惠卷
  const coupons = await Coupon.find();
  res.status(200).send(coupons);
});

module.exports.updateCoupon = catchError(async (req, res, next) => { // 更新優惠卷
  const keys = ['state', 'couponCode'];
  const reqKeys = Object.keys(req.body);
  const checkKey = keys.some(d => reqKeys.includes(d));
  if (checkKey) return next(new AppError(400, 'Invalid value'));

  try {
    const coupon = await Coupon.findByIdAndUpdate(req.body.id, req.body, { new: true });
    res.status(200).send(coupon);
  } catch (error) {
    return next(new AppError(500, error));
  }
});

module.exports.deleteCoupons = catchError(async (req, res, next) => { // 刪除優惠卷
  try {
    await Coupon.findByIdAndDelete(req.body.id);
    res.status(200).send({ message: 'success!' });
  } catch (error) {
    return next(new AppError(500, error));
  }
});

module.exports.deleteManyCoupons = catchError(async (req, res, next) => { // 批次刪除優惠卷
  if (!req.body.couponsIds.length) return next(400, 'Fields length must gt 1');
  await Coupon.deleteMany({ _id: { $in: req.body.couponsIds } });
  res.status(200).send({ message: 'success!' });
});

module.exports.getCouponAndUpdate = catchError(async (req, res, next) => { // 更新用戶正在使用的優惠卷
  try {
    const coupon = await Coupon.findOne({ couponCode: req.body.couponCode, isUsed: { "$ne": req.user._id } });
    if (!coupon) return next(new AppError(404, 'not Found!'));
    const cart = await Cart.findByIdAndUpdate(req.body.cartId, { 'useCoupon': coupon._id }, { new: true });
    if (!cart) return next(new AppError(404, 'not Found!'));
    res.status(200).send({ message: 'success!', cart, coupon });
  } catch (error) {
    return next(new AppError(500, error));
  }
});