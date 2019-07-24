const BoardServices = require('../services/board.service');

async function createBoard(req, res, next) {
  try {
    const {board , user} = req;  
    const result = await BoardServices.createBoard(user, board);
    res.status(201).send({message : 'Create Board Success!', result})
  } catch (error) {
    next(error)
  }
}

async function getBoards(req, res, next) {
  try {
    const queryString = req.query.q || '', userId = req.user._id;
    const boards = await BoardServices.getBoards(queryString, userId);
    res.status(200).send(boards)
  } catch (error) {
    next(error);
  }
}

async function getBoard(req, res) {
  try {
    const boardId = req.params.boardId, userId = req.user._id;
    const board = await BoardServices.getBoard(userId, boardId);
    res.status(200).send(board)
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message})
  }
}

async function updateBoard(req, res, next) {
  try {
    const board = req.board, name = req.body.title;
    const result = await BoardServices.updateBoard(board, name);
    res.status(200).send({ message : 'Update Success' , result})
  } catch (error) {
    next(error);
  }
}


async function deleteBoard(req, res, next) {
  try {
    const board = req.board;  
    await BoardServices.deleteBoard(board);
    res.status(204).send({message : 'Board has removed!'});
  } catch (error) {
    next(error);
  }
}
module.exports = {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
  getBoard
}
