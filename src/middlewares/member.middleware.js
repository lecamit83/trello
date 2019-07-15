const Board = require('../models/board.model');
const { isMember, isAdmin } = require('../utils');

function ownerPermission(req, res, next) {
  next();
}

async function adminPermission(req, res, next) {
  try {
    let userId = req.user._id;
    let boardId = req.params.boardId;
    let board = await Board.findOne({_id : boardId});
    if(!board) {
      return res.status(404).send({message : 'Board Not Found'});
    }
   
    if(!isAdmin(board.members, userId)){
      return res.status(403).send({ message : 'Forbidden'})
    }

    req.board = board;
    next();
  } catch (error) {
    next(error);
  }
}

async function memberPermission(req, res, next) {
  try {
    let userId = req.user._id;
    let boardId = req.params.boardId;
    let board = await Board.findOne({_id : boardId});
    if(!board) {
      return res.status(404).send({message : 'Board Not Found'});
    }
    if(!isMember(board.members, userId)){
      return res.status(403).send({ message : 'Forbidden'})
    }
    req.board = board;
    next();
  } catch (error) {
    next(error);
  }
}
module.exports = {
  adminPermission,
  memberPermission,
  ownerPermission
}
