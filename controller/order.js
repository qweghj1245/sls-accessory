const Order = require('../model/order');
const Cart = require('../model/cart');
const Coupon = require('../model/coupon');
const { catchError, AppError } = require('../utils/error');
const { generateCode } = require('../utils/randomCode');
const stripe = require('stripe')(process.env.STRIPE_KEY);

module.exports.getOrders = catchError(async (req, res, next) => { // 取得（使用者）所有訂單
  let config;
  if (req.user.identity != 'admin') {
    config = {
      user: req.user._id
    };
  }
  const orders = await Order.find(config);
  res.status(200).send(orders);
});

module.exports.getCheckoutSession = catchError(async (req, res, next) => { // 創建訂單後付款 
  const { successUrl, cancelUrl, ...otherData } = req.body;
  try {
    const order = new Order({
      ...otherData,
      email: req.user.email,
      orderNumber: generateCode(10),
      transactionNumber: generateCode(10),
      user: req.user._id
    });

    const checkout = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: successUrl + '/' + order._id + '?status=done',
      cancel_url: cancelUrl,
      customer_email: req.user.email,
      client_reference_id: JSON.parse(JSON.stringify(order._id)),
      line_items: [
        {
          name: `${req.user.name} 在 ${new Date()} 創建訂單`,
          description: '這是一個新訂單',
          images: [`${req.user.photo}`],
          amount: req.body.amount,
          currency: 'usd',
          quantity: 1
        }
      ]
    });

    const userCart = await Cart.findOne({ user: req.user._id });
    userCart.products = [];
    await userCart.save();

    const coupon = await Coupon.findById(userCart.useCoupon);
    if (coupon) {
      if (coupon.useLimit == 1) coupon.isUsed.push(req.user._id);
      await coupon.save();
    }
    order.sessionId = checkout.id;
    await order.save();
    res.status(200).send({ order, checkout, userCart, coupon });
  } catch (error) {
    return next(new AppError(error));
  }
});

module.exports.getOrder = catchError(async (req, res, next) => { // 取得單一訂單
  const order = await Order.findById(req.body.orderId);
  if (!order) return next(new AppError(404, 'Cannot found order!'));
  res.status(200).send(order);
});

module.exports.updateOrderStatus = catchError(async (req, res, next) => {
  const order = await Order.findById(req.body.id);
  const orderStatus = ['notYet', 'handling', 'isComplete'];
  const payStatus = ['isPay', 'noPay'];
  const deliveryStatus = ['notYet', 'inStock', 'shipped'];
  if (!orderStatus.includes(req.body.orderStatus))
    return next(new AppError(400, 'Your order fields is not correct'));
  if (!payStatus.includes(req.body.payStatus))
    return next(new AppError(400, 'Your pay fields is not correct'));
  if (!deliveryStatus.includes(req.body.delivery))
    return next(new AppError(400, 'Your delivery fields is not correct'));
  order.orderStatus = req.body.orderStatus;
  order.payStatus = req.body.payStatus;
  order.delivery = req.body.delivery;
  await order.save();
  return res.status(200).send(order);
});