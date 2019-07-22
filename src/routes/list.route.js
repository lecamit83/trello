const express = require('express');
const { isAuth } = require('../middlewares/user.middleware');
const { memberPermission } = require('../middlewares/member.middleware');

const {
  getLists,
  createList,
  updateList,
  deleteList
} = require('../controllers/list.controller');

const router = express.Router();

router.route('/lists')
  .get(isAuth, memberPermission, getLists)
  .post(isAuth, memberPermission, createList)

router.route('/lists/:listId')
  .patch(isAuth, memberPermission, updateList)
  .delete(isAuth , memberPermission, deleteList);

module.exports = router;
