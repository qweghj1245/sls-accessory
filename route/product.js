const express = require('express');
const router = express.Router();
const product = require('../controller/product');
const { auth, restrictTo } = require('../utils/auth');

router.route('/')
  .post(auth, restrictTo('admin'), product.createProduct)

router.route('/allProduct')
  .get(product.getAllProducts)

module.exports = router;
