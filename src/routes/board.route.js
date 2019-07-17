const express = require('express');
const { verifyAuth } = require('../middlewares/user.middleware');
const { verifyBoard } = require('../middlewares/board.middleware');
const { adminPermission, memberPermission } = require('../middlewares/member.middleware');
const {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
  getBoard
} = require('../controllers/board.controller');

var router = express.Router();

router.route('/boards')
  .post(verifyAuth, verifyBoard, createBoard)
  .get(verifyAuth, getBoards);
router.route('/boards/:boardId')
  .patch(verifyAuth, adminPermission, updateBoard)
  .delete(verifyAuth, adminPermission, deleteBoard)
  .get(verifyAuth, getBoard);
//search
module.exports = router;
