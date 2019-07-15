const Board = require('../models/board.model');
const { formatTitle } = require('../utils');
async function createBoard(req, res, next) {
  try {
    var board = new Board(req.board);
    await board.save();
    
    req.user.boards.push({boardId : board._id});
    await req.user.save();

    res.status(201).send({ message : 'Success', board });
  } catch (error) {
    next(error);
  }
}

async function getBoards(req, res) {
  try {

    let id = req.user._id;
    
    let results = await Board.find({'members.userId' : id});


    res.status(200).send(results);
  
  } catch (error) {
    res.status(500).send(error);
  }
}
async function getBoard(req, res) {
  try {
    let boardId = req.params.boardId;
    let result = await Board.findOne({_id : boardId});
    res.status(200).send(result);
  
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
    let { board } = req;
   
    req.user.boards = req.user.boards.filter( e => e.boardId.toString() !== board._id.toString());
    console.log(req.user);
    
    await board.remove();
    await req.user.save();
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
  deleteBoard,
  getBoard
}
