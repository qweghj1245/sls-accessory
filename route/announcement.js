const express = require('express');
const router = express.Router();
const announcement = require('../controller/announcement');
const { auth, restrictTo } = require('../utils/auth');

router.route('/')
  .post(auth, restrictTo('admin'), announcement.createAnnouncement)
  .patch(auth, restrictTo('admin'), announcement.updateAnnouncement)
  .delete(auth, restrictTo('admin'), announcement.deleteAnnouncement)

router.route('/getAnnouncements')
  .post(announcement.getAnnouncements)

module.exports = router;