const express = require('express');
const router = express.Router();
const user = require('../controller/user');

router
  .route('/')
  .post(user.createUser)

module.exports = router;