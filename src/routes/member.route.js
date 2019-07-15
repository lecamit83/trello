const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middlewares/user.middleware');
const { adminPermission, memberPermission } = require('../middlewares/member.middleware');
const {
  inviteMember,
  removeMember,
  updatePermission
} = require('../controllers/member.controller');

router.route('/:boardId')
  .post(verifyAuth, memberPermission, inviteMember);

router.route('/:boardId/:userId')
  .delete(verifyAuth, adminPermission, removeMember)
  .patch(verifyAuth, adminPermission, updatePermission);

  module.exports = router;

  
