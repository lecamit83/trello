const express = require('express');
const {
  verifyAuth
} = require('../middlewares/user.middleware');
const {
  adminPermission, memberPermission
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
  addInfo
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

router.route('/:boardId/:listId')
  .post(verifyAuth, memberPermission, verifyList, createCard)
  .get(verifyAuth, memberPermission, verifyList, getCards);


router.route('/:boardId/:listId/:cardId')
  .put(verifyAuth, memberPermission, verifyList, addInfo)
  .patch(verifyAuth, memberPermission, verifyList, updateCard)
  .delete(verifyAuth, memberPermission, verifyList, deleteCard);

router.route('/:boardId/:listId/:cardId/members')
  .post(verifyAuth, memberPermission, verifyList, verifyCard, addMemberIntoCard);


router.route('/:boardId/:listId/:cardId/members/:userId')
  .delete(verifyAuth, memberPermission, verifyList, verifyCard, removeMemberInCard);

module.exports = router;
