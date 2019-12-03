const Product = require('../model/product');
const { catchError, AppError } = require('../utils/error');

module.exports.createProduct = catchError(async (req, res, next) => { // 創建商品
  try {
    const product = await Product.create({
      ...req.body,
      updatePerson: req.user.name,
    });
    res.status(201).send(product);
  } catch (error) {
    return next(new AppError(500, 'Server Error'));
  }
});

module.exports.getAllProducts = catchError(async (req, res, next) => {  // 取得所有商品
  try {
    const products = await Product.find().sort('-createAt');
    res.status(200).send(products);
  } catch (error) {
    return next(new AppError(500, 'Server Error')); 
  }
});