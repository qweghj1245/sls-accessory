const Announcement = require('../model/announcement');
const { catchError, AppError } = require('../utils/error');

module.exports.createAnnouncement = catchError(async (req, res, send) => { // 創建公告
  const announcement = await Announcement.create({
    ...req.body,
    createUser: req.user._id,
  });
  res.status(200).send(announcement);
});

module.exports.getAnnouncements = catchError(async (req, res, next) => { // 取得所有公告
  const findConfig = {};
  if (req.body.isActive) findConfig.isActive = true;
  const announcements = await Announcement.find(findConfig);
  res.status(200).send(announcements);
});

module.exports.updateAnnouncement = catchError(async (req, res, next) => { // 更新公告
  try {
    const { id, ...otherFields } = req.body;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, otherFields, { new: true });
    if (!updatedAnnouncement) return next(400, 'Some operating is wrong!');
    res.status(200).send(updatedAnnouncement);
  } catch (error) {
    return next(500, 'Server Error');
  }
});

module.exports.deleteAnnouncement = catchError(async (req, res, next) => { // 刪除單一公告
  if (!req.body.id) return next(400, 'Missing field!');
  await Announcement.findByIdAndDelete(req.body.id);
  res.status(200).send({ message: 'success!' });
});