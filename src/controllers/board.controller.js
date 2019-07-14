const Board = require('../models/board.model');
const { formatTitle } = require('../utils');
async function createBoard(req, res, next) {
  try {
    var board = new Board(req.board);
    await board.save();

    res.status(201).send({ message : 'Success', board });
  } catch (error) {
    next(error);
  }
}

async function getBoards(req, res) {
  try {

    let id = req.user._id;
    let results = await Board.find({'partners.personId' : id});
    res.status(200).send(results);
  
  } catch (error) {
    res.status(500).send(error);
  }
}

async function updateBoard(req, res, next) {
  try {
    let boardName = formatTitle(req.body.title);
    let board = req.board;
    board.title = boardName;
    await board.save();
    res.status(200).send({ message : 'Update Success' });
  } catch (error) {
    next(error);
  }
}

async function searchBoard(req, res, next) {
  try {
    let regex = new RegExp(req.params.title, 'i'); 
    let results = await Board.find({ title : regex });
    if(!results) {
      return res.status(404).send({message : 'Board Not Found!'});
    }
    res.status(200).send(results)
  } catch (error) {
    next(error);
  }
}

async function deleteBoard(req, res, next) {
  try {
    let { board , participant } = req;
    await board.remove();
    await participant.remove();
    res.status(204).send({message : 'Board has removed!'});
  } catch (error) {
    next(error);
  }
}
module.exports = {
  createBoard,
  getBoards,
  updateBoard,
  searchBoard,
  deleteBoard
}
