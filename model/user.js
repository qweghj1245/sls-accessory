const mongoose = require('mongoose');
const validate = require('validator');

const UserSchema = new mongoose.Schema({
  email: {               
    type: String,
    required: [true, 'You need to provide EMAIL'],
    unique: true,
    trim: true,
    validate(val) {
      if (!validate.isEmail(val)) {
        throw new Error('Email format is not correct');
      }
    },
  },
  password: {
    type: String,
    required: [true, 'You need to provide PASSWORD'],
    minlength: 6,
    trim: true,
    validate(val) {
      if (validate.contains(val, 'password')) {
        throw new Error('Your password is low effect');
      }
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, 'You need to provide password to compare two password'],
    select: false,
    validate(val) {
      return val === this.password;
    },
  },
  identity: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  name: {
    type: String,
    required: [true, 'NAME is required'],
  },
  address: String,
  phoneNumber: Number,
  photo: String,
  createAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
  passwordChangeTime: {
    type: Date,
    default: Date.now(),    
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
});

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordConfirm;
  delete userObject.tokens;
  return userObject;
};

module.exports = mongoose.model('User', UserSchema);