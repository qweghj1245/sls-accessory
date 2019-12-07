const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'You need provide name field!'],
  },
  classification: {
    type: String,
    enum: ['首頁精選商品', '紙製品', '手機配件', '包包提袋', '其他'],
    required: [true, 'You need provide classification field!'],
  },
  description: String,
  photos: [ // length < 4
    {
      photo: String,
    },
  ],
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
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;