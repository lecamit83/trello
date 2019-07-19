const express = require('express');
const { verifyAuth } = require('../middlewares/user.middleware');
const { memberPermission } = require('../middlewares/member.middleware');

const {
  getLists,
  createList,
  updateList,
  deleteList
} = require('../controllers/list.controller');

const router = express.Router();



router.route('/lists')
  .get(verifyAuth, memberPermission, getLists)
  .post(verifyAuth, memberPermission, createList)

router.route('/lists/:listId')
  .patch(verifyAuth, memberPermission, updateList)
  .delete(verifyAuth , memberPermission, deleteList);

module.exports = router;
