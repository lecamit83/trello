const ListModel = require('../models/list.model');
const CardModel = require('../models/card.model');
const { isEmpty, formatTitle } = require('../utils');
const { ObjectId } = require('mongoose').Types;

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

function createList(board, title) {
  if(isEmpty(title)) {
    return Promise.reject({ statusCode : 400, message : 'Title is Empty'});
  }
  title = formatTitle(title);
  
  return ListModel.create({ title , from : board._id})
  .then(function(list) {
    // add listId into board
    board.lists.push({list : list._id});
    return Promise.all([board.save(), list.save()]);
  })
  .then(function([board, list]) {
    return list;
  });
}

function updateList(listId, title) {
  if(isEmpty(title)) {
    return Promise.reject({ statusCode : 400, message : 'Title List is Empty'});
  }
  title = formatTitle(title);
  return ListModel.findById(listId).exec()
  .then(function(list) {
    // update title
    list.title = title;
    return list.save();
  });
}
function deleteList(board, listId) {
  return ListModel.findById(listId)
  .then(function(list) {
    if(!list) {
      return Promise.reject({ statusCode : 404 , message : 'List Not Found!'});
    }
    // remove listId in board.lists
    board.lists = board.lists.filter(e => e.list.toString() !== listId.toString());
    return Promise.all([board.save(), list.save(), CardModel.find({from : listId})]);
  })
  .then(function([board, list, cards]) {
    // remove all cards was contained in list
    cards.forEach(async function (card) {
      await card.remove();
    });
    return list.remove();
  });
}

function isListExist(listId) {
  if(!listId || !ObjectId.isValid(listId)) {
    return Promise.reject({ statusCode : 400, message : 'ListID invalid'});
  }
  return ListModel.findById(listId).exec()
  .then(function(list) {
    if(!list) {
      return Promise.reject({ statusCode : 404, message : 'List Not Found!'});
    }
    return list;
  })
}
module.exports = {
  getLists,
  createList,
  updateList,
  deleteList,
  isListExist,

}
