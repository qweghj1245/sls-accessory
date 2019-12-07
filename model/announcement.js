const mongoose = require('mongoose');

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


const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;