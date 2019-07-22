const BoardModel = require('../models/board.model');
const ListModel = require('../models/list.model');
const CardModel = require('../models/card.model');
const UserModel = require('../models/user.model');

const { isEmpty, formatTitle } = require('../utils');
/**
 * @name createBoard
 * 
 * @param { Object } user 
 * @param { Object } board 
 * @description 
 *  create a Board and then insert boardId and userId
 * 
 * @returns board
 * 
 */
function createBoard(user, board) {
  return BoardModel.create(board)
  .then(function(board) {
    // insert boardId into user and userId into board
    board.members.push({ userId : user._id , isAdmin : true });
    user.boards.push({ boardId : board._id});
    return Promise.all([board.save(), user.save()]);
  })
  .then(function([board, user]) {
    return board;
  });
}

/**
 * @name getBoards
 * @param { String } queryString 
 * @param { ObjectId } userId 
 * @description 
 *  findAll or findBy queryString
 * @returns boards
 */
function getBoards(queryString, userId) {
  if(isEmpty(queryString)) {
    return BoardModel.find({'members.userId' : userId}).select('_id title').exec();
  }
  let regex = new RegExp(queryString, 'i');
  return BoardModel.find({ 'members.userId' : userId, title : regex }).select('_id title').exec();
}

/**
 * @name getBoard
 * @param { ObjectId } userId 
 * @param { ObjectId } boardId 
 * 
 * @returns one board
 */

function getBoard(userId, boardId) {
  return BoardModel.findOne({_id : boardId , 'members.userId' : userId})
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
  .exec()
  .then(function(board) {
    if(!board) {
      return Promise.reject({statusCode : 404, message : 'Board Not Found!'});
    }
    return board;
  });
}

/**
 * @name updateBoard
 * @param { String } board
 * @param { String } name
 * 
 * 
 * @returns board
 */
function updateBoard(board, name) {
  // check name falsy
  if(!name) {
    return Promise.reject({statusCode : 400, message : 'Name Invalid'});
  }
  // format Title
  name = formatTitle(name);
  //update
  board.title = name;
  return board.save();
}



function deleteBoard(board) {
  const id = board._id;

  return UserModel.findByBoardId(id)
  .then(function(users) {
    users.forEach(async function (user){
      user.boards = user.boards.filter( e => e.boardId.toString() !== id.toString());
      await user.save();
    });
    return ListModel.findByBoardId(id);
  })
  .then(function(lists) {
    lists.forEach(async function(list){
      let cards = await CardModel.find({ from : list._id});
      cards.forEach(async function (card) {
        await card.remove();
      });
      await list.remove();
    });
    return board.remove();
  });
}
module.exports = {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
}
