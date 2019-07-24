const BoardModel = require('../models/board.model');
const ListModel = require('../models/list.model');
const CardModel = require('../models/card.model');
const UserModel = require('../models/user.model');
const APIError = require('../errors/APIError');
const NotFound = require('../errors/NotFoundError');
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
async function createBoard(user, board) {
  const board = await BoardModel.create(board);
  // insert boardId into user and userId into board
  board.members.push({ userId : user._id , isAdmin : true });
  user.boards.push({ boardId : board._id});
  
  await board.save();
  await user.save();

  return board;
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
  return BoardModel.find({'members.userId' : userId}).select('_id title').exec();
}

/**
 * @name getBoard
 * @param { ObjectId } userId 
 * @param { ObjectId } boardId 
 * 
 * @returns one board
 */

async function getBoard(userId, boardId) {
  const board = await BoardModel.findOne({_id : boardId , 'members.userId' : userId})
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
  .orFail(new NotFound('Board'))
  .exec();
  return board;
}

/**
 * @name updateBoard
 * @param { String } board
 * @param { String } name
 * 
 * 
 * @returns board
 */
async function updateBoard(board, name) {
  // check name falsy
  if(!name) {
    throw new APIError('Name Invalid', 400);
  }
  // format Title
  name = formatTitle(name);
  //update
  board.title = name;
  await board.save();
  
  return board;
}


/**
 * 
 * @param { Object Board } board 
 * @returns none
 */
async function deleteBoard(board) {
  const id = board._id;

  const users = await UserModel.findByBoardId(id);
  if(!users) throw new NotFound('User Not Found!');

  for (const user of users) {
    user.boards = user.boards.filter( e => e.boardId.toString() !== id.toString());
    await user.save();
  }

  const lists = await ListModel.findByBoardId(id);
  for (const list of lists) {
    const cards = await CardModel.find({ _id : list._id });
    for (const card of cards) {
      await card.remove();
    }
    await list.remove();
  }
  await board.remove();
  return board;
}
module.exports = {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
}
