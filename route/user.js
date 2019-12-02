const express = require('express');
const router = express.Router();
const user = require('../controller/user');
const { auth } = require('../utils/auth');

router
  .route('/')
  .post(user.createUser)
  .get(auth, user.getUser)
  .patch(auth, user.updateUser)

router
  .route('/login')
  .post(user.userLogin)

router
  .route('/logout')
  .post(auth, user.userLogout)

router
  .route('/logout_all')
  .post(auth, user.userLogoutAll)

router
  .route('/changePassword')
  .post(auth, user.changePassword)

router
  .route('/forgetPassword')
  .post(user.forgetPassword)

router
  .route('/resetPassword')
  .post(user.resetPassword)

module.exports = router;