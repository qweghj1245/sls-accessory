const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: String,
  payStatus: {
    type: String,
    enum: ['isPay', 'noPay'],
    default: 'noPay',
  },
  orderStatus: {
    type: String,
    enum: ['notYet', 'handling', 'isComplete'],
    default: 'notYet',
  },
  delivery: {
    type: String,
    enum: ['notYet', 'inStock', 'shipped'],
    default: 'notYet',
  },
  contactPerson: {
    type: String,
    required: [true, 'Missing Field!'],
  },
  contactPhoneNumber: {
    type: String,
    required: [true, 'Missing Field!'],
  },
  recipientPerson: {
    type: String,
    required: [true, 'Missing Field!'],
  },
  recipientPhoneNumber: {
    type: String,
    required: [true, 'Missing Field!'],
  },
  recipientPostalCode: {
    type: Number,
    required: [true, 'Missing Field!'],
  },
  recipientCounty: {
    type: String,
    required: [true, 'Missing Field!'],
  },
  recipientArea: {
    type: String,
    required: [true, 'Missing Field!'],
  },
  invioce: {
    type: String,
    default: '寄送給我',
  },
  payment: {
    type: String,
    default: 'creditCard',
  },
  transactionNumber: String,
  uniformNumbers: String,
  country: String,
  transport: String,
  email: String,
  coupon: mongoose.Schema.Types.ObjectId,
  user: mongoose.Schema.Types.ObjectId,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
  exprireCode: {
    type: String,
    select: false,
  },
}, {
  timestamps: true,
});

OrderSchema.pre('save', function(next) {
  this.populate('cart');
  next();
});
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;