const express = require('express');
const {
  verifyAuth
} = require('../middlewares/user.middleware');
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

router.route('/')
  .get((req, res) => {
    res.send('card');
  })

router.route('/cards')
  .post(verifyAuth, memberPermission, verifyList, createCard)
  .get(verifyAuth, memberPermission, verifyList, getCards);


router.route('/cards/:cardId')
  .patch(verifyAuth, memberPermission, updateCard)
  .delete(verifyAuth, memberPermission, deleteCard)
  .get(verifyAuth, memberPermission, getCard)
  .put(verifyAuth, memberPermission, verifyCard, changeList);

router.route('/cards/:cardId/members')
  .post(verifyAuth, memberPermission, verifyCard, addMemberIntoCard);


router.route('/cards/:cardId/members/:userId')
  .delete(verifyAuth, memberPermission, verifyCard, removeMemberInCard);

router.route('/cards/:cardId/comments')
  .post(verifyAuth, memberPermission, verifyCard, addComment);

router.route('/cards/:cardId/comments/:idx')
  .delete(verifyAuth, adminPermission, verifyCard, deletedComment)
  .patch(verifyAuth, memberPermission, verifyCard, updatedComment);

router.route('/cards/:cardId/tasks')
  .post(verifyAuth, memberPermission, verifyCard, createdTask)
  
router.route('/cards/:cardId/tasks/:taskId')
  .post(verifyAuth, memberPermission, createdContentTask)
  .delete(verifyAuth, memberPermission, deletedTask)

router.route('/cards/:cardId/tasks/:taskId/contents/:idx')
  .delete(verifyAuth, memberPermission, deletedContentTask)

router.route('/cards/:cardId/duetime')
  .put(verifyAuth, memberPermission, verifyCard, createdDueTime)
  .delete(verifyAuth, memberPermission, verifyCard, deletedDueTime);
router.route('/cards/:cardId/description')
  .put(verifyAuth, memberPermission, verifyCard, createdDescription)
  .delete(verifyAuth, memberPermission, verifyCard, deletedDescription);

module.exports = router;
