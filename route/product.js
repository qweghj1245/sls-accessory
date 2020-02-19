const express = require('express');
const router = express.Router();
const product = require('../controller/product');
const { auth, restrictTo } = require('../utils/auth');

router.route('/')
  .post(auth, restrictTo('admin'), product.createProduct)
  .get(product.getAllProducts)
  .patch(auth, restrictTo('admin'), product.updateProduct)

router.route('/getProductById/:id')
  .get(product.getProductById)

router.route('/updateManyActive')
  .post(auth, restrictTo('admin'), product.updateManyActive)

router.route('/deleteProduct')
  .delete(auth, restrictTo('admin'), product.deleteManyProduct)

router.route('/collectProduct')
  .post(auth, product.collectProduct)

router.route('/getCollectProducts')
  .post(auth, product.getCollectProducts)

router.route('/createProdcuts')
  .post(auth, product.createProducts)

module.exports = router;
