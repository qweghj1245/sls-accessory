const express = require('express');
const app = express();
const helmet = require('helmet');


app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// db
require('./db');

//route
const userRoute = require('../route/user');
const productRoute = require('../route/product');
const announcementRoute = require('../route/announcement');
const cartRoute = require('../route/cart');
const couponRoute = require('../route/coupon');
const orderRoute = require('../route/order');
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/announcement', announcementRoute);
app.use('/cart', cartRoute);
app.use('/coupon', couponRoute);
app.use('/order', orderRoute);

//send for no path
app.all('*', (req, res, next) => {
  res.status(404).send({
    status: 'fail',
    massage: `yout route ${req.originalUrl} is not found`,
  });
});

//error handle
const error = require('../controller/error');
app.use(error);

module.exports = app;