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
  getCard,
  createdTask,
  deletedTask,
  createdContentTask,
  deletedContentTask,
  createdDueTime,
  createdDescription,
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

router.route('/boards/:boardId/lists/:listId/cards')
  .post(verifyAuth, memberPermission, verifyList, createCard)
  .get(verifyAuth, memberPermission, verifyList, getCards);


router.route('/boards/:boardId/cards/:cardId')
  .patch(verifyAuth, memberPermission, updateCard)
  .delete(verifyAuth, memberPermission, deleteCard)
  .get(verifyAuth, memberPermission, getCard)
  .put(verifyAuth, memberPermission, verifyCard, changeList);

router.route('boards/:boardId/cards/:cardId/members')
  .post(verifyAuth, memberPermission, verifyCard, addMemberIntoCard);


router.route('/boards/:boardId/cards/:cardId/members/:userId')
  .delete(verifyAuth, memberPermission, verifyCard, removeMemberInCard);

router.route('/boards/:boardId/cards/:cardId/comments')
  .post(verifyAuth, memberPermission, verifyCard, addComment);

router.route('/boards/:boardId/lists/:listId/cards/:cardId/comments/:idx')
  .delete(verifyAuth, adminPermission, deletedComment);  


router.route('/boards/:boardId/cards/:cardId/tasks')
  .post(verifyAuth, memberPermission, createdTask)
  
router.route('/boards/:boardId/cards/:cardId/tasks/:taskId')
  .post(verifyAuth, memberPermission, createdContentTask)
  .delete(verifyAuth, memberPermission, deletedTask)

router.route('/boards/:boardId/cards/:cardId/tasks/:taskId/contents/:idx')
  .delete(verifyAuth, memberPermission, deletedContentTask)

router.route('/boards/:boardId/cards/:cardId/duetime')
  .post(verifyAuth, memberPermission, createdDueTime);
router.route('/boards/:boardId/cards/:cardId/description')
  .post(verifyAuth, memberPermission, verifyCard, createdDescription)
module.exports = router;