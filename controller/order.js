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
  const orders = await Order.find(config).populate({
    path: 'cart',
    select: 'products',
    populate: {
      path: 'products.product',
    },
  });
  res.status(200).send(orders);
});

module.exports.getCheckoutSession = catchError(async (req, res, next) => { // 創建訂單後付款 
  try {
    const order = new Order({
      ...req.body,
      orderNumber: generateCode(10),
      transactionNumber: generateCode(10),
      user: req.user._id
    });

    const checkout = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/`,
      cancel_url: `${req.protocol}://${req.get('host')}/`,
      customer_email: req.user.email,
      client_reference_id: JSON.parse(JSON.stringify(order._id)),
      line_items: [
        {
          name: `${req.user.name} order at ${new Date()}`,
          description: 'This is a new Order',
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
    if (coupon.useLimit == 1) coupon.isUsed.push(req.user._id);
    await coupon.save();

    order.sessionId = checkout.id;
    await order.save();
    res.status(200).send({ order, checkout, userCart, coupon});
  } catch (error) {
    return next(new AppError(error));
  }
});


