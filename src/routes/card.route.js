const express = require('express');
const { isAuth } = require('../middlewares/user.middleware');
const {
  adminPermission, 
  memberPermission
} = require('../middlewares/member.middleware');
const { isListExist, isCardExist } = require('../middlewares/board.middleware');

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

const { addMemberIntoCard, removeMemberInCard } = require('../controllers/member.controller');
const router = express.Router();

router.route('/cards')
  .post(isAuth, memberPermission, isListExist, createCard)
  .get(isAuth, memberPermission, isListExist, getCards);


router.route('/cards/:cardId')
  .patch(isAuth, memberPermission, updateCard)
  .delete(isAuth, memberPermission, deleteCard)
  .get(isAuth, memberPermission, getCard)
  .put(isAuth, memberPermission, isCardExist, changeList);

router.route('/cards/:cardId/members')
  .post(isAuth, memberPermission, isCardExist, addMemberIntoCard);


router.route('/cards/:cardId/members/:userId')
  .delete(isAuth, memberPermission, isCardExist, removeMemberInCard);

router.route('/cards/:cardId/comments')
  .post(isAuth, memberPermission, isCardExist, addComment);

router.route('/cards/:cardId/comments/:idx')
  .delete(isAuth, adminPermission, isCardExist, deletedComment)
  .patch(isAuth, memberPermission, isCardExist, updatedComment);

router.route('/cards/:cardId/tasks')
  .post(isAuth, memberPermission, isCardExist, createdTask)
  
router.route('/cards/:cardId/tasks/:taskId')
  .post(isAuth, memberPermission, createdContentTask)
  .delete(isAuth, memberPermission, deletedTask)

router.route('/cards/:cardId/tasks/:taskId/contents/:idx')
  .delete(isAuth, memberPermission, deletedContentTask)

router.route('/cards/:cardId/duetime')
  .put(isAuth, memberPermission, isCardExist, createdDueTime)
  .delete(isAuth, memberPermission, isCardExist, deletedDueTime);
router.route('/cards/:cardId/description')
  .put(isAuth, memberPermission, isCardExist, createdDescription)
  .delete(isAuth, memberPermission, isCardExist, deletedDescription);

module.exports = router;
