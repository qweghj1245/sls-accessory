const User = require('../model/user');
const { catchError, AppError } = require('../utils/error');
module.exports.createUser = catchError(async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports.getUser = (req, res) => {
  res.send({ msg: 'tessssssddt' });
};