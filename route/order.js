const express = require('express');
const router = express.Router();
const order = require('../controller/order');
const { auth, restrictTo } = require('../utils/auth');

router.route('/')
  .get(auth, order.getOrders)
  .post(auth, order.getCheckoutSession)

router.route('/checkout')
  .post(auth, order.getStripeOrder)

  module.exports = router;
