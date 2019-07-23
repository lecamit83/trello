const CardModel = require('../models/card.model');
const ListModel = require('../models/list.model');
const { ObjectId } = require('mongoose').Types;
const { isEmpty, formatTitle, isAdmin, isOwner, isValidDate } = require('../utils');

function isCardExist(listId, cardId) {
  if (!listId || !ObjectId.isValid(listId)) {
    return Promise.reject({ statusCode: 400, message: 'ListID invalid' });
  }
  if (!cardId || !ObjectId.isValid(cardId)) {
    return Promise.reject({ statusCode: 400, message: 'CardID invalid' });
  }
  return CardModel.findOne({ _id: cardId, from: listId }).exec()
    .then(function (card) {
      if (!card) {
        return Promise.reject({ statusCode : 404, message : 'Card Not Found!'});
      }
      return card;
    });
}

function createCard(list, title) {
  title = formatTitle(title);
  if(isEmpty(title)) {
    return Promise.reject({ statusCode : 400, message : 'Title is Empty!'});
  }

  return CardModel.create({title , from : list._id})
  .then(function (card) {
    list.cards.push({ card : card._id});
    return Promise.all([card.save(), list.save()]);
  });
}

function getCards(listId) {
  return CardModel.find({ from : listId }).populate({
    path: 'members.user',
    select : 'name',
  }).exec();
}

function getCard(listId, cardId) {
  return CardModel.findOne({ _id : cardId, from : listId})
  .populate({
    path : 'members.user',
    select : 'name',
  })
  .populate({
    path : 'comments.user',
    select : 'name'
  }).exec()
  .then(function(card) {
    if(!card) {
      return Promise.reject({ statusCode : 404, message : 'Card Not Found!'});
    }
    return card;
  });
}

function updateCard(card, title) {
  title = formatTitle(title);
  if(isEmpty(title) || !title) {
    return Promise.reject({ statusCode : 422, message : 'Title is empty!'});
  }

  card.title = title;
  return card.save();
}

function deleteCard(card) {
  return ListModel.findOne({ _id : card.from }).exec()
  .then(function(list) {
    if(!list) {
      return Promise.reject({ statusCode : 404, message : 'List Not Found!'});
    }
    list.cards = list.cards.filter(e => e.card.toString() !== card._id.toString());

    return Promise.all([list.save(), card.remove()]);
  });
}

function createTask(card, task) {
  task = task.trim();

  if(isEmpty(task)) {
    return Promise.reject({ statusCode : 422, message : 'Task is Empty!'});
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

function createContentTask(card, taskId, content) {
  if(isEmpty(content)) {
    return Promise.reject({ statusCode : 400, message : 'Content Task is Empty!'});
  }
  let task = card.tasks.find(e => e._id.toString() === taskId.toString());

  if (!task) {
    return Promise.reject({ statusCode : 404, message : 'Task Not Found!'});
  }
  task.contents.push(content);

  return card.save();
}

function deleteContentTask(card, taskId, idx) {
  let task = card.tasks.find(e => e._id.toString() === taskId.toString());

  if (!task) {
    return Promise.reject({statusCode : 404 , message : 'Task Not Found!'});
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
function updateComment(card, userId, idx, comment) {
  console.log('a');
  
  if(isNaN(idx)) {
    return Promise.reject({statusCode : 400, message : 'Index Invalid!'});
  }
  console.log('a');
  const index = Number.parseInt(idx);
  console.log('a');
  if (index >= card.comments.length || index < 0) { 
    return Promise.reject({statusCode : 400, message : 'Unfound Message!'}); 
  }
  // isOwner Comment
  if (!isOwner(card.comments[index].user, userId)) {
    return Promise.reject({ statusCode : 403, message : 'Forbidden!'});
  }
  card.comments[index].comment = comment;

  return card.save();
}

function deleteComment(board, card, idx, userId) {
  if(isNaN(idx)) {
    return Promise.reject({statusCode : 400, message : 'Index Invalid!'});
  }
  const index = Number.parseInt(idx);
  
  if (index > card.comments.length || index < 0) { 
    return Promise.reject({statusCode : 400, message : 'Unfound Message!'}); 
  }

  if (!isAdmin(board.members, userId) || !isOwner(card.comments[index].user, userId)) {
    return Promise.reject({ statusCode : 403, message : 'Forbidden!'});
  }

  card.comments = card.comments.filter(function (message, index) {
    if (index.toString() !== idx) return message;
  });
  
  return card.save();
}

function createDueTime(card, dueTime) {
  if(!isValidDate(dueTime.toString())) {
    Promise.reject({statusCode : 400, message : 'Invalid Date, format : mm/dd/yyyy'});
  }
  card.dueTime = dueTime;
  return card.save();
}

function deleteDueTime(card) {
  card.dueTime = undefined;
  return card.save();  
}

function createDescription(card, description) {
  if(isEmpty(description)) {
    Promise.reject({ statusCode : 400, message : 'Description is Empty'});
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
function moveCard(card, listId) {
  return Promise.all([ListModel.findOne({ _id : listId}), ListModel.findOne({_id : card.from})])
  .then(function([destList, sourceList]) {
    if(!destList) {
      return Promise.reject({statusCode : 404, message : 'List Not Found!'});
    }
    if(!sourceList) {
      return Promise.reject({statusCode : 400, message : 'List Was Removed!'});
    }
    sourceList.cards = sourceList.cards.filter(function (e) {
      return e.card.toString() !== card._id.toString();
    });
    destList.cards.push({ card: card._id });
    return Promise.all([card.save(), destList.save(), sourceList.save()]);
  });
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
