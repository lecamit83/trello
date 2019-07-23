const CardServices = require('../services/card.service');

function createCard(req, res) {
  let list = req.list, title = req.body.title;

  CardServices.createCard(list, title)
    .then(function ([card, list]) {
      return res.status(201).send({ message: 'Create Card Success!' });
    })
    .catch(error => res.status(error.statusCode || 500).send({ message: error.message }));
}


function getCards(req, res) {
  const listId = req.list._id;

  CardServices.getCards(listId)
    .then(cards => res.status(200).send(cards))
    .catch(error => res.status(500).send({ message: error.message }));
}

function getCard(req, res) {
  let cardId = req.params.cardId, listId = req.body.listId;

  CardServices.getCard(listId, cardId)
    .then(card => res.status(200).send(card))
    .catch(error => res.status(error.statusCode || 500).send({ message: error.message }));
}

function updateCard(req, res) {
  let title = req.body.title, card = req.card;

  CardServices.updateCard(card, title)
    .then(card => res.status(200).send(card))
    .catch(error => res.status(error.statusCode).send({ message: error.message }));
}

function deleteCard(req, res) {
  let card = req.card;

  CardServices.deleteCard(card)
    .then(([list, card]) => res.status(204).send({ message: 'Delete Card Success!' }))
    .catch(error => res.status(error.statusCode || 500).send({ message: error.message }));
}

function createTask(req, res) {
  let card = req.card, task = req.body.task;

  CardServices.createTask(card, task)
  .then(card => res.status(201).send({ message: 'Created New Main Task Success' , card}))
  .catch(error => res.status(error.statusCode || 500).send({message : error.message}));
}
function deleteTask(req, res, next) {
  let card = req.card, taskId = req.params.taskId;
  
  CardServices.deleteTask(card, taskId)
  .then(card => res.status(204).send({message : 'Delete Task Success'}))
  .catch(error => next(error));
}
function createContentTask(req, res, next) {
  let card = req.card, taskId = req.params.taskId, content = req.body.content;
  
  CardServices.createContentTask(card, taskId, content)
  .then(card => res.status(201).send({message : 'Create Content Task Success'}))
  .catch(error => next(error));
}
function deleteContentTask(req, res, next) {
  let card = req.card, taskId = req.params.taskId, idx = req.params.idx;
  
  CardServices.deleteContentTask(card, taskId, idx)
  .then(card => res.status(204).send({ message : 'Delete Content Task'}))
  .catch(error => next(error));
}

function addComment(req, res, next) {
  let card = req.card, userId = req.user._id, comment = req.body.comment;
  
  CardServices.addComment(card, userId, comment)
  .then(card => res.status(201).send({ message : 'Add Comment Success!'}))
  .catch(error => next(error));
}

function updateComment(req, res, next) {
  const card = req.card, comment = req.body.comment, idx = req.params.idx;
 
  CardServices.updateComment(card, userId, idx, comment)
  .then(card => res.status(200).send({message : 'Update Comment'}))
  .catch(error => res.status(error.statusCode || 500).send({message : error.message}));  
}

function deleteComment(req, res, next) {
  const { board, card } = req, idx = req.params.idx, userId = req.user._id;
 
  CardServices.deleteComment(board, card, idx, userId)
  .then(card => res.status(204).send({message : 'Delete Comment'}))
  .catch(error => res.status(error.statusCode || 500).send({message : error.message}));
}

function createDueTime(req, res, next) {
  let dueTime = req.body.dueTime, card = req.card;

  CardServices.createDueTime(card, dueTime)
  .then(card => res.status(200).send({message : 'Update DueTime Success!'}))
  .catch(error => res.status(error.statusCode || 500).send({message : error.message}));
}

async function deleteDueTime(req, res, next) {
  let card = req.card;

  CardServices.deleteDueTime(card)
  .then(card => res.status(204).send({ message: 'Deleted DueTime' }))
  .catch(error => next(error));
}

function createDescription(req, res, next) {
  let description = req.body.description, card = req.card;
  
  CardServices.createDescription(card, description)
  .then(card => res.status(200).send({ message : 'Update Description' , card}))
  .catch(error => res.status(error.statusCode || 500).send({message : error.message}));
}

async function deleteDescription(req, res, next) {
  let card = req.card;

  CardServices.deleteDescription(card)
  .then(card => res.status(204).send({ message: 'Deleted Description' }))
  .catch(error => next(error));
}

function changeList(req, res, next) {
  let card = req.card, listId = req.body.listId;
  
  CardServices.moveCard(card, listId)
  .then(() => res.status(200).send({message : 'Change List Success!'}))
  .catch((error) => res.status(error.statusCode || 500).send({message : error.message}));
}

module.exports = {
  createCard,
  getCards,
  getCard,
  updateCard,
  deleteCard,
  addComment,
  deleteComment,
  updateComment,
  createTask,
  deleteTask,
  createContentTask,
  deleteContentTask,
  createDueTime,
  deleteDueTime,
  createDescription,
  deleteDescription,
  changeList
}
