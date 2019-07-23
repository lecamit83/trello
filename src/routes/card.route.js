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
  deleteComment,
  updateComment,
  getCard,
  createTask,
  deleteTask,
  createContentTask,
  deleteContentTask,
  createDueTime,
  deleteDueTime,
  createDescription,
  deleteDescription,
  changeList
} = require('../controllers/card.controller');

const { addMemberIntoCard, removeMemberInCard } = require('../controllers/member.controller');
const router = express.Router();

router.route('/cards')
  .post(isAuth, memberPermission, isListExist, createCard)
  .get(isAuth, memberPermission, isListExist, getCards);


router.route('/cards/:cardId')
  .patch(isAuth, memberPermission, isCardExist, updateCard)
  .delete(isAuth, memberPermission, isCardExist, deleteCard)
  .get(isAuth, memberPermission, getCard)
  .put(isAuth, memberPermission, isCardExist, changeList);

router.route('/cards/:cardId/members')
  .post(isAuth, memberPermission, isCardExist, addMemberIntoCard);


router.route('/cards/:cardId/members/:userId')
  .delete(isAuth, memberPermission, isCardExist, removeMemberInCard);

router.route('/cards/:cardId/comments')
  .post(isAuth, memberPermission, isCardExist, addComment);

router.route('/cards/:cardId/comments/:idx')
  .delete(isAuth, adminPermission, isCardExist, deleteComment)
  .patch(isAuth, memberPermission, isCardExist, updateComment);

router.route('/cards/:cardId/tasks')
  .post(isAuth, memberPermission, isCardExist, createTask)
  
router.route('/cards/:cardId/tasks/:taskId')
  .post(isAuth, memberPermission, isCardExist, createContentTask)
  .delete(isAuth, memberPermission, isCardExist, deleteTask)

router.route('/cards/:cardId/tasks/:taskId/contents/:idx')
  .delete(isAuth, memberPermission, isCardExist, deleteContentTask)

router.route('/cards/:cardId/duetime')
  .put(isAuth, memberPermission, isCardExist, createDueTime)
  .delete(isAuth, memberPermission, isCardExist, deleteDueTime);
router.route('/cards/:cardId/description')
  .put(isAuth, memberPermission, isCardExist, createDescription)
  .delete(isAuth, memberPermission, isCardExist, deleteDescription);

module.exports = router;
