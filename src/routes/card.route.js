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
  updateCard,
  deleteCard,
  addInfo
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
  .put(verifyAuth, memberPermission, verifyList, addInfo)
  .patch(verifyAuth, memberPermission, verifyList, updateCard)
  .delete(verifyAuth, memberPermission, verifyList, deleteCard);

router.route('/:boardId/:listId/:cardId/members')
  .get()
  .post()
  .delete();
module.exports = router;
