const Product = require('../model/product');
const { catchError, AppError } = require('../utils/error');

module.exports.createProduct = catchError(async (req, res, next) => { // 創建商品
  try {
    const product = await Product.create({
      ...req.body,
      updatePerson: req.user._id,
    });
    res.status(201).send(product);
  } catch (error) {
    return next(new AppError(500, error));
  }
});

module.exports.getAllProducts = catchError(async (req, res, next) => {  // 取得所有商品
  try {
    const products = await Product.find().sort('-createAt');
    res.status(200).send(products);
  } catch (error) {
    return next(new AppError(500, error));
  }
});

module.exports.getProductById = catchError(async (req, res, next) => { // 取得單一商品
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) return next(new AppError(404, 'Cannot find product!'));
  product.viewingCount += 1;
  await product.save();
  res.status(200).send(product);
});

module.exports.updateProduct = catchError(async (req, res, next) => { // 更新單一商品
  const updateField = ['_id', 'updatePerson'];
  const keys = Object.keys(req.body);
  const checkAll = keys.some(key => updateField.includes(key));
  if (checkAll) return next(new AppError('Server Error!'));

  try {
    const product = await Product.findByIdAndUpdate({ _id: req.body.id }, {
      ...req.body,
      updateAt: Date.now(),
      updatePerson: req.user._id,
    }, { new: true });
    if (!product) {
      return next(new AppError(500, 'Server Error!'));
    }

    res.status(200).send(product);
  } catch (error) {
    return next(new AppError(500, error));
  }
});

module.exports.updateManyActive = catchError(async (req, res, next) => { // 批次上架商品
  if (!req.body.productIds.length) return next(400, 'Fields length must gt 1');
  await Product.updateMany({ _id: { $in: req.body.productIds } }, { $set: { isActive: req.body.isActive } });
  res.status(200).send({ message: 'success!' });
});

module.exports.deleteManyProduct = catchError(async (req, res, next) => { // 批次刪除商品
  if (!req.body.productIds.length) return next(400, 'Fields length must gt 1');
  await Product.deleteMany({ _id: { $in: req.body.productIds } });
  res.status(200).send({ message: 'success!' });
});

module.exports.collectProduct = catchError(async (req, res, next) => { // 收藏、不收藏商品
  let product;
  if (req.body.isCollected) {
    product = await Product.findByIdAndUpdate({ _id: req.body.id }, { $addToSet: { collector: req.user._id } }, { new: true });
  } else {
    product = await Product.findByIdAndUpdate({ _id: req.body.id }, { $pull: { collector: req.user._id } }, { new: true });
  }
  res.status(200).send(product);
});

module.exports.getCollectProducts = catchError(async (req, res, next) => { // 取得該使用者所有收藏
  const product = await Product.find({ collector: { $all: req.user._id }});
  res.send(product);
});