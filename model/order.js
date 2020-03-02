const mongoose = require('mongoose');
const { dateParse } = require('../utils/dateParse');

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
  recipientAddress: {
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
  cart: mongoose.Schema.Types.ObjectId,
  products: Array,
  exprireCode: {
    type: String,
    select: false,
  },
  sessionId: String,
  amount: Number,
  email: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

OrderSchema.methods.toJSON = function () {
  const orderObject = this.toObject();
  const changeArr = ['createdAt', 'updatedAt'];
  return dateParse(orderObject, changeArr);
};

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;