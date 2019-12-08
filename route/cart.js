const express = require('express');
const router = express.Router();
const cart = require('../controller/cart');
const { auth, restrictTo } = require('../utils/auth');

router.route('/')
  .get(auth, cart.getCarts)
  .post(auth, cart.addToCart)
  .delete(auth, cart.deleteCart)

module.exports = router;