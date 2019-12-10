const express = require('express');
const router = express.Router();
const coupon = require('../controller/coupon');
const { auth, restrictTo } = require('../utils/auth');

router.route('/')
  .post(auth, restrictTo('admin'), coupon.createCoupon)
  .get(auth, restrictTo('admin'), coupon.getCoupons)
  .patch(auth, restrictTo('admin'), coupon.updateCoupon)
  .delete(auth, restrictTo('admin'), coupon.deleteCoupons)

module.exports = router;