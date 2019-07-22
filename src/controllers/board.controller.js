const Board = require('../models/board.model');
const List = require('../models/list.model');
const Card = require('../models/card.model');
const User = require('../models/user.model');
const BoardServices = require('../services/board.service');
const { formatTitle ,isEmpty } = require('../utils');

function createBoard(req, res, next) {
  let {board , user} = req;

  BoardServices.createBoard(user, board)
  .then(result => res.status(201).send({message : 'Create Board Success!', result}))
  .catch(error => next(error));
}

function getBoards(req, res, next) {
  let q = req.query.q || '', id = req.user._id;
  
  BoardServices.getBoards(q, id)
  .then(boards => res.status(200).send(boards))
  .catch(error => next(error));
}

function getBoard(req, res) {
  let boardId = req.params.boardId, userId = req.user._id;
  // get a board from user by BoardId
  BoardServices.getBoard(userId, boardId)
  .then(board => res.status(200).send(board))
  .catch(error => res.status(error.statusCode || 500).send({message : error.message}));
}

function updateBoard(req, res, next) {
  let board = req.board;
  let name = req.body.title;
  // update name of board
  BoardServices.updateBoard(board, name)
  .then(board => res.status(200).send({ message : 'Update Success' , board}))
  .catch(error => next(error));
}


async function deleteBoard(req, res, next) {
  let board = req.board;
  BoardServices.deleteBoard(board)
  .then(() => res.status(204).send({message : 'Board has removed!'}))
  .catch(error => next(error));
}
module.exports = {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
  getBoard
}
