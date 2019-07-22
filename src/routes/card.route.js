const express = require('express');
const { isAuth } = require('../middlewares/user.middleware');
const {
  adminPermission, 
  memberPermission
} = require('../middlewares/member.middleware');
const {
  verifyList,
  verifyCard
} = require('../middlewares/board.middleware');

const {
  createCard,
  getCards,
  updateCard,
  deleteCard,
  addComment,
  deletedComment,
  updatedComment,
  getCard,
  createdTask,
  deletedTask,
  createdContentTask,
  deletedContentTask,
  createdDueTime,
  deletedDueTime,
  createdDescription,
  deletedDescription,
  changeList
} = require('../controllers/card.controller');

const {
  addMemberIntoCard,
  removeMemberInCard
} = require('../controllers/member.controller');
const router = express.Router();


router.route('/cards')
  .post(isAuth, memberPermission, verifyList, createCard)
  .get(isAuth, memberPermission, verifyList, getCards);


router.route('/cards/:cardId')
  .patch(isAuth, memberPermission, updateCard)
  .delete(isAuth, memberPermission, deleteCard)
  .get(isAuth, memberPermission, getCard)
  .put(isAuth, memberPermission, verifyCard, changeList);

router.route('/cards/:cardId/members')
  .post(isAuth, memberPermission, verifyCard, addMemberIntoCard);


router.route('/cards/:cardId/members/:userId')
  .delete(isAuth, memberPermission, verifyCard, removeMemberInCard);

router.route('/cards/:cardId/comments')
  .post(isAuth, memberPermission, verifyCard, addComment);

router.route('/cards/:cardId/comments/:idx')
  .delete(isAuth, adminPermission, verifyCard, deletedComment)
  .patch(isAuth, memberPermission, verifyCard, updatedComment);

router.route('/cards/:cardId/tasks')
  .post(isAuth, memberPermission, verifyCard, createdTask)
  
router.route('/cards/:cardId/tasks/:taskId')
  .post(isAuth, memberPermission, createdContentTask)
  .delete(isAuth, memberPermission, deletedTask)

router.route('/cards/:cardId/tasks/:taskId/contents/:idx')
  .delete(isAuth, memberPermission, deletedContentTask)

router.route('/cards/:cardId/duetime')
  .put(isAuth, memberPermission, verifyCard, createdDueTime)
  .delete(isAuth, memberPermission, verifyCard, deletedDueTime);
router.route('/cards/:cardId/description')
  .put(isAuth, memberPermission, verifyCard, createdDescription)
  .delete(isAuth, memberPermission, verifyCard, deletedDescription);

module.exports = router;
