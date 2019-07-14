const express = require('express');
const { verifyAuth } = require('../middlewares/user.middleware');
const { verifyBoard, verifyPermission } = require('../middlewares/board.middleware');
const {
  createBoard,
  getBoards,
  updateBoard,
  searchBoard,
  deleteBoard
} = require('../controllers/board.controller');
var router = express.Router();

router.route('/')
  .post(verifyAuth, verifyBoard, createBoard)
  .get(verifyAuth, getBoards);
router.route('/:boardId')
  .patch(verifyAuth, verifyPermission, updateBoard)
  .delete(verifyAuth, verifyPermission, deleteBoard);
//search
module.exports = router;
