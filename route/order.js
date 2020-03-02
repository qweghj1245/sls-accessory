const express = require('express');
const router = express.Router();
const order = require('../controller/order');
const { auth, restrictTo } = require('../utils/auth');

router.route('/')
  .get(auth, order.getOrders)
  .post(auth, order.getCheckoutSession)
  
router.route('/getOrder')
  .post(auth, order.getOrder)

router.route('/updateOrderStatus')
  .patch(auth, order.updateOrderStatus)

  module.exports = router;
