const express = require('express');
const router = express.Router();
const { isAuth } = require('../middlewares/user.middleware');
const { adminPermission, memberPermission } = require('../middlewares/member.middleware');
const {
  inviteMember,
  removeMember,
  updatePermission
} = require('../controllers/member.controller');

router.route('/members')
  .post(isAuth, memberPermission, inviteMember);

router.route('/members/:userId')
  .delete(isAuth, adminPermission, removeMember)
  .patch(isAuth, adminPermission, updatePermission);

  module.exports = router;

  
