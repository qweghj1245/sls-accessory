const mongoose = require('mongoose');
const { dateParse } = require('../utils/dateParse');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'You need provide name field!'],
  },
  classification: {
    type: String,
    enum: ['home', 'paper', 'phoneAcc', 'bag', 'others'],
    required: [true, 'You need provide classification field!'],
  },
  description: String,
  photos: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: [true, 'Incomplete field!'],
  },
  sizeDescription: String,
  quantity: {
    type: Number,
    default: 999999,
    required: [true, 'Incomplete field!'],
  },
  colors: [String],
  size: [String],
  previewProducts: [
    {
      color: String,
      price: Number,
      quantity: Number,
    },
  ],
  collector: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  updatePerson: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  salesQuantity: {
    type: Number,
    default: 0,
  },
  viewingCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

ProductSchema.methods.toJSON = function () {
  const productObject = this.toObject();
  const changeArr = ['createdAt', 'updatedAt'];
  return dateParse(productObject, changeArr);
};

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;