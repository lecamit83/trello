const CardModel = require('../models/card.model');
const ListModel = require('../models/list.model');
const { ObjectId } = require('mongoose').Types;
const { isEmpty, formatTitle, isAdmin, isOwner, isValidDate } = require('../utils');
const NotFound = require('../errors/NotFoundError');
const APIError = require('../errors/APIError');

async function isCardExist(listId, cardId) {
  if (!listId || !ObjectId.isValid(listId)) {
    throw new APIError('ListID invalid');
  }
  if (!cardId || !ObjectId.isValid(cardId)) {
    throw new APIError('CardID invalid');
  }
  const card = await CardModel.findOne({ _id: cardId, from: listId }).orFail(new NotFound('Card Not Found!')).exec();
  return card;
}

async function createCard(list, title) {
  title = formatTitle(title);
  if(isEmpty(title)) {
    throw new APIError('Title is Empty!');
  }
  const card = await CardModel.create({title , from : list._id});
  list.cards.push({ card : card._id});

  await card.save();
  await list.save();

  return card;
}

function getCards(listId) {
  return CardModel.find({ from : listId }).populate({
    path: 'members.user',
    select : 'name',
  }).exec();
}

async function getCard(listId, cardId) {
  const card = await CardModel.findOne({ _id : cardId, from : listId})
  .populate({
    path : 'members.user',
    select : 'name',
  })
  .populate({
    path : 'comments.user',
    select : 'name'
  }).orFail(new NotFound('Card Not Found!')).exec()
  return card;
}

async function updateCard(card, title) {
  title = formatTitle(title);
  if(isEmpty(title) || !title) {
    throw new APIError('Title is empty!', 422);
  }

  card.title = title;
  await card.save();
  return card;
}

async function deleteCard(card) {
  const list = await ListModel.findOne({ _id : card.from }).orFail(new NotFound('List Not Found!')).exec();
  console.log(list);
  
  list.cards = list.cards.filter(e => e.card.toString() !== card._id.toString());
  await list.save();
  await card.remove();
  return card;
}

async function createTask(card, task) {
  if(isEmpty(task)) {
    throw new APIError('Task is Empty!', 422);
  }
  card.tasks.push({ title : task, contents : []});
  return card.save();
}

function deleteTask(card, taskId) {
  card.tasks = card.tasks.filter(function (task) {
    return task._id.toString() !== taskId.toString();
  });

  return card.save();
}

async function createContentTask(card, taskId, content) {
  if(isEmpty(content)) {
    throw new APIError('Content Task is Empty!', 422);
  }
  let task = card.tasks.find(e => e._id.toString() === taskId.toString());

  if (!task) {
    throw new NotFound('Task Not Found!');
  }
  task.contents.push(content);

  return card.save();
}

async function deleteContentTask(card, taskId, idx) {
  let task = card.tasks.find(e => e._id.toString() === taskId.toString());

  if (!task) {
    throw new NotFound('Task Not Found!');
  } 

  task.contents = task.contents.filter(function (content, index) {
    if (index.toString() !== idx) return content;
  });

  return card.save();
}

function addComment(card, user, comment) {
  card.comments.push({ user, comment });
  return card.save();
}
/**
 * eerro
 * @param {*} card 
 * @param {*} userId 
 * @param {*} idx 
 * @param {*} comment 
 */
async function updateComment(card, userId, idx, comment) {
  if(isNaN(idx)) {
    throw new APIError('Index Invalid!');
  }
  const index = Number.parseInt(idx);
  if (index >= card.comments.length || index < 0) { 
    throw new APIError('Unfound Message!'); 
  }
  // isOwner Comment
  if (!isOwner(card.comments[index].user, userId)) {
    throw new APIError('Forbidden!', 403);
  }
  card.comments[index].comment = comment;

  return card.save();
}

async function deleteComment(board, card, idx, userId) {
  if(isNaN(idx)) {
    throw new APIError('Index Invalid!');
  }
  const index = Number.parseInt(idx);
  
  if (index >= card.comments.length || index < 0) { 
    throw new APIError('Unfound Message!'); 
  }

  if (!isAdmin(board.members, userId) || !isOwner(card.comments[index].user, userId)) {
    throw new APIError('Forbidden!', 403);
  }

  card.comments = card.comments.filter(function (message, index) {
    if (index.toString() !== idx) return message;
  });
  
  return card.save();
}

async function createDueTime(card, dueTime) {
  if(!isValidDate(dueTime.toString())) {
    throw new APIError('Invalid Date, format : mm/dd/yyyy');
  }
  card.dueTime = dueTime;
  return card.save();
}

function deleteDueTime(card) {
  card.dueTime = undefined;
  return card.save();  
}

async function createDescription(card, description) {
  if(isEmpty(description)) {
    throw new APIError('Description is Empty');
  }
  card.description = description;

  return card.save();
}

function deleteDescription(card) {
  card.description = undefined;
  return card.save();
}
/**
 * @name moveCard
 * 
 * @param { Object } card 
 * @param { String } listId id of destinate List 
 * 
 * @description move card from source list to dest list
 */
async function moveCard(card, listId) {
  const sourceList = await ListModel.findOne({_id : card.from}).orFail(new NotFound('Source List Not Found!')).exec();
  const destList = await ListModel.findOne({ _id : listId}).orFail(new NotFound('DestList Not Found!')).exec();

  sourceList.cards = sourceList.cards.filter(function (e) {
    return e.card.toString() !== card._id.toString();
  });
  destList.cards.push({ card: card._id });

  await destList.save();
  await sourceList.save();
  return card;
}

module.exports = {
  isCardExist,
  createCard,
  getCards,
  getCard,
  updateCard,
  deleteCard,
  createTask,
  deleteTask,
  createContentTask,
  deleteContentTask,
  addComment,
  updateComment,
  deleteComment,
  createDueTime,
  deleteDueTime,
  createDescription,
  deleteDescription,
  moveCard,
}
