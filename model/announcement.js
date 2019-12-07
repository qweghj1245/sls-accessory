const mongoose = require('mongoose');
const { dateParse } = require('../utils/dateParse');

const announcementSchema = new mongoose.Schema({
  subject: String,
  connectUrl: {
    type: String,
    required: [true, 'Incomplete field!'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Incomplete field!'],
  },
  startDate: {
    type: Date,
    required: [true, 'Incomplete field!'],
  },
  endDate: {
    type: Date,
    expires: 0,
    required: [true, 'Incomplete field!'],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  createUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Incomplete field!'],
  },
}, {
  timestamps: true,
});

announcementSchema.methods.toJSON = function () {
  const announcementObject = this.toObject();
  const changeArr = ['createdAt', 'updatedAt', 'startDate', 'endDate'];
  return dateParse(announcementObject, changeArr);
};

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;