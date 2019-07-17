const Board = require('../models/board.model');
const List = require('../models/list.model');
const Card = require('../models/card.model');
const User = require('../models/user.model');
const { formatTitle ,isEmpty } = require('../utils');
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
    let q = req.query.q || '',
        id = req.user._id;
    let results;

    if(isEmpty(q)) { 
      results = await Board.find({'members.userId' : id}).select('_id title').exec();  
    } else {
      let regex = new RegExp(q, 'i'); 
      results = await Board.find({ 'members.userId' : id, title : regex }).select('_id title');
    }
    res.status(200).send(results);
  
  } catch (error) {
    res.status(500).send(error);
  }
}
async function getBoard(req, res) {
  try {
    let boardId = req.params.boardId;
    let result = await Board.findOne({_id : boardId})
      .populate({
        path : 'members.userId',
        select : 'name email'
      })
      .populate({
        path : 'lists.list',
        select : 'title cards',
        populate : {
          path : 'cards.card',
          select : 'title members dueTime',
          populate : {
            path: 'members.user',
            select : 'name'
          }
        }
      })
      .exec();
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


async function deleteBoard(req, res, next) {
  try {
    let id = req.params.boardId;
    let { board } = req;
   
    let users = await User.find({'boards.boardId': id });
    users.forEach(async function (user){
      user.boards = user.boards.filter( e => e.boardId.toString() !== id.toString());
      await user.save();
    });
    
    let lists = await List.find({ from : id });
    lists.forEach(async function(list){
      let cards = await Card.find({ from : list._id});
      cards.forEach(async function (card) {
        await card.remove();
      });
      await list.remove();
    });

    await board.remove();
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
