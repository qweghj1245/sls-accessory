const Cart = require('../model/cart');
const { catchError, AppError } = require('../utils/error');

module.exports.getCarts = catchError(async (req, res, next) => { // 取得個人購物車
  const carts = await Cart.findOne({ user: req.user._id }).populate({
    path: 'products.product',
    select: { name: 1, price: 1, photos: 1, collector: 1, createdAt: 1, updatedAt: 1 },
  });
  res.status(200).send(carts);
});

module.exports.addToCart = catchError(async (req, res, next) => { // 加入購物車
  try {
    const { color, size, product } = req.body;
    const historyMatchfield = await Cart.findOne({ user: req.user._id });
    let count = 0;
    if (historyMatchfield) {
      historyMatchfield.products.forEach(item => {
        if (item.size == size && item.color == color && item.product == product) {
          item.purchaseQuantity += req.body.purchaseQuantity;
          count += 1;
        }
      });
      if (count == 0) {
        historyMatchfield.products.push(req.body);
      }
      await historyMatchfield.save();
      return res.status(200).send(historyMatchfield);
    }

    const products = [req.body];
    const addCart = await Cart.create({
      products,
      user: req.user._id
    });
    res.status(201).send(addCart);
  } catch (error) {
    return next(AppError(500, "Server Error!"));
  }
});

module.exports.deleteCart = catchError(async (req, res, next) => { // 刪除購物車項目
  try {
    const userCarts = await Cart.findOne({ user: req.user._id });
    userCarts.products = userCarts.products.filter(item => item._id != req.body.id);
    await userCarts.save();
    res.status(200).send({ message: 'success!' });
  } catch (error) {
    return next(400, "Invalid Field!");
  }
});