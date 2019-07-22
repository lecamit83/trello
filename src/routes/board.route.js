const express = require('express');
const { isAuth } = require('../middlewares/user.middleware');
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
  .post(isAuth, verifyBoard, createBoard)
  .get(isAuth, getBoards);
router.route('/boards/:boardId')
  .patch(isAuth, adminPermission, updateBoard)
  .delete(isAuth, adminPermission, deleteBoard)
  .get(isAuth, getBoard);
//search
module.exports = router;
