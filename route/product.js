const express = require('express');
const router = express.Router();
const product = require('../controller/product');
const { auth, restrictTo } = require('../utils/auth');

router.route('/')
  .post(auth, restrictTo('admin'), product.createProduct)

router.route('/allProduct')
  .get(product.getAllProducts)

router.route('/getProductById/:id')
  .get(product.getProductById)

router.route('/updateProduct/:id')
  .patch(auth, restrictTo('admin'), product.updateProduct)

router.route('/updateManyActive')
  .post(auth, restrictTo('admin'), product.updateManyActive)

router.route('/deleteProduct')
  .delete(auth, restrictTo('admin'), product.deleteManyProduct)

router.route('/collectProduct')
  .post(auth, product.collectProduct)

module.exports = router;
