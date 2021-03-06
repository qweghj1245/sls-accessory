const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { AppError } = require('../utils/error');
const { dateParse } = require('../utils/dateParse');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'You need to provide EMAIL'],
    unique: [true, 'werjiowerjiowe'],
    trim: true,
    validate(val) {
      if (!validate.isEmail(val)) {
        throw new Error('Email format is not correct');
      }
    },
  },
  password: {
    type: String,
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
  orderLength: {
    type: String,
    default: 0,
  },
  passwordChangeTime: {
    type: Date,
    default: Date.now(),
  },
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
  userSource: {
    type: String,
    default: 'local',
    enum: ['local', 'google'],
  },
  postalCode: Number,
  county: String,
  area: String,
  address: String,
  phoneNumber: String,
  photo: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,
});

UserSchema.methods.toJSON = function () {
  let userObject = this.toObject();
  const changeArr = ['createdAt', 'updatedAt', 'passwordChangeTime'];
  let obj = dateParse(userObject, changeArr);
  delete obj.password;
  delete obj.tokens;
  if (this.userSource == 'google') delete obj.passwordChangeTime;
  return obj;
};

UserSchema.statics.findByCredential = async function (email, password, next) { // 找到使用者 然後 比較密碼
  const user = await User.findOne({ email });
  if (!user) return next(new AppError(404, 'Cannot find user!'));
  const verify = await bcrypt.compare(password, user.password);
  if (!verify) return next(new AppError(404, 'Your password is not correct!'));
  return user;
};

UserSchema.methods.generateToken = async function () { // 生成 token
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, { expiresIn: '90d' });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

UserSchema.methods.createResetPasswordToken = function () { // 重置密碼用token
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
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
