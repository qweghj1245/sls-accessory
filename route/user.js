const express = require('express');
const router = express.Router();
const user = require('../controller/user');

router
  .route('/')
  .post(user.createUser)

router
  .route('/login')
  .post(user.userLogin)

module.exports = router;