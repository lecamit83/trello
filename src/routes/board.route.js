const express = require('express');
const { verifyAuth } = require('../middlewares/user.middleware');
const { verifyBoard } = require('../middlewares/board.middleware');
const { adminPermission, memberPermission } = require('../middlewares/member.middleware');
const {
  createBoard,
  getBoards,
  updateBoard,
  searchBoard,
  deleteBoard,
  getBoard
} = require('../controllers/board.controller');

var router = express.Router();

router.route('/')
  .post(verifyAuth, verifyBoard, createBoard)
  .get(verifyAuth, getBoards);
router.route('/:boardId')
  .patch(verifyAuth, adminPermission, updateBoard)
  .delete(verifyAuth, adminPermission, deleteBoard)
  .get(verifyAuth, getBoard);
//search
module.exports = router;
