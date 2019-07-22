const express = require('express');
const router = express.Router();
const { isAuth } = require('../middlewares/user.middleware');
const { adminPermission, memberPermission } = require('../middlewares/member.middleware');
const {
  addMemberIntoBoard,
  removeMemberInBoard,
  updatePermission
} = require('../controllers/member.controller');

router.route('/members')
  .post(isAuth, memberPermission, addMemberIntoBoard);

router.route('/members/:userId')
  .delete(isAuth, adminPermission, removeMemberInBoard)
  .patch(isAuth, adminPermission, updatePermission);

  module.exports = router;

  
