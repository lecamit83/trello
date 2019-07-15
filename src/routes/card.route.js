const express = require('express');
const {
  verifyAuth
} = require('../middlewares/user.middleware');
const {
  adminPermission, memberPermission
} = require('../middlewares/member.middleware');
const {
  verifyList
} = require('../middlewares/board.middleware');

const {
  createCard,
  getCards,
  updateNameCard,
  deleteCard
} = require('../controllers/card.controller');
const router = express.Router();

router.route('/')
  .get((req, res) => {
    res.send('card');
  })

router.route('/:boardId/:listId')
  .post(verifyAuth, memberPermission, verifyList, createCard)
  .get(verifyAuth, memberPermission, verifyList, getCards);


router.route('/:boardId/:listId/:cardId')
  .patch(verifyAuth, memberPermission, verifyList, updateNameCard)
  .delete(verifyAuth, memberPermission, verifyList, deleteCard);
module.exports = router;
