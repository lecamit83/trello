const ListModel = require('../models/list.model');
const CardModel = require('../models/card.model');
const { isEmpty, formatTitle } = require('../utils');
const { ObjectId } = require('mongoose').Types;
const NotFound = require('../errors/NotFoundError');
const APIError = require('../errors/APIError');

function getLists(boardId) {
  return ListModel.findByBoardId(boardId)
  .populate({
    path : 'cards.card',
    select : 'title members dueTime',
    populate : {
      path : 'members.user',
      select : 'name',
    }
  })
  .exec();
}

async function createList(board, title) {
  if(isEmpty(title)) {
    throw new APIError('Title is Empty');
  }
  title = formatTitle(title);
  
  const list = await ListModel.create({title, from : board._id});
  board.lists.push({list : list._id});

  await board.save();
  await list.save();
  
  return board;
}

async function updateList(listId, title) {
  if(isEmpty(title)) {
    throw new APIError('Title List is Empty');
  }
  title = formatTitle(title);
  const list = await ListModel.findById(listId).orFail(new NotFound('List Not Found!')).exec()

  // update title
  list.title = title;

  await list.save();

  return list;
}
async function deleteList(board, listId) {
  const list = await ListModel.findById(listId).orFail(new NotFound('List Not Found!')).exec();
  board.lists = board.lists.filter(e => e.list.toString() !== listId.toString());
  
  await board.save();

  const cards =await CardModel.find({ from : listId });
  for (const card of cards) {
    await card.remove();
  }

  await list.remove();
}

async function isListExist(listId) {
  if(!listId || !ObjectId.isValid(listId)) {
    throw new APIError('ListID invalid');
  }
  const list = await ListModel.findById(listId).orFail(new NotFound('List Not Found!')).exec();
  return list;
}
module.exports = {
  getLists,
  createList,
  updateList,
  deleteList,
  isListExist,

}
