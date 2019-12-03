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
    required: true,
  },
  sizeDescription: String,
  quantity: {
    type: Number,
    default: 999999,
    required: true,
  },
  previewProducts: [
    {
      color: String,
      price: Number,
      quantity: Number,
    },
  ],
  collector: [String],
  createAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
  updatePerson: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;