const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/error');

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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    }
  ],
});

UserSchema.methods.toJSON = function () { // 隱藏敏感資訊
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

UserSchema.statics.findByCredential = async function (email, password, next) { // 找到使用者 然後 比較密碼
  const user = await User.findOne({ email });
  if (!user) return next(new AppError(404, 'Cannot find user!'));
  const verify = bcrypt.compare(password, user.password);
  if (!verify) return next(new AppError(404, 'Your password is not correct!'));
  return user;
};

UserSchema.methods.generateToken = async function () { // 生成 token
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, { expiresIn: '90d' });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

UserSchema.pre('save', async function (next) { // 加密
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangeTime = Date.now() - 1000;
    this.passwordConfirm = undefined;
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
