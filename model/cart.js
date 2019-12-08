const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      color: String,
      size: String,
      purchaseQuantity: Number,
    },
  ],
  user: mongoose.Schema.Types.ObjectId,
});

CartSchema.index({ user: 1 });

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;