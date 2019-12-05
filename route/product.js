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
  .patch(auth, product.updateProduct)

router.route('/updateManyActive')
  .post(auth, product.updateManyActive)

router.route('/deleteProduct')
  .delete(auth, product.deleteManyProduct)

module.exports = router;
