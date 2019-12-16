const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  name: String,
  couponCode: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    min: 10,
    max: 100,
    required: true,
  },
  useLimit: {
    type: Number,
    default: -1,
    enum: [1, -1],
  },
  startAt: {
    type: Date,
    default: Date.now(),
    required: [true, 'start time must be required!'],
  },
  expireAt: {
    type: Date,
    expires: 0,
  },
  state: {
    type: String,
    enum: ['notActive', 'inEffect', 'lapse'],
    default: 'notActive',
  },
  createUser: mongoose.Schema.Types.ObjectId,
  isUsed: [
    {
      type: mongoose.Schema.Types.ObjectId,
    }
  ],
});

CouponSchema.index({ expireAt: 1 });

CouponSchema.pre('save', function (next) {
  if (this.startAt < Date.now() && this.expireAt > Date.now()) {
    this.state = 'inEffect';
  } else if (this.expireAt < Date.now()) {
    this.state = 'lapse';
  }
  next();
});

const Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;