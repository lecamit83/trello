const CardServices = require('../services/card.service');

async function createCard(req, res) {
  try {
    const list = req.list, title = req.body.title;
    await CardServices.createCard(list, title);
    res.status(201).send({ message: 'Create Card Success!' });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
}


async function getCards(req, res) {
  try {
    const listId = req.list._id;
    const cards = await CardServices.getCards(listId);
    res.status(200).send(cards);
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message })
  }
}

async function getCard(req, res) {
  try {
    const cardId = req.params.cardId, listId = req.body.listId;
    const card = await CardServices.getCard(listId, cardId);
    res.status(200).send(card)
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message })
  }
}

async function updateCard(req, res) {
  try {
    const title = req.body.title, card = req.card;
    const card = await CardServices.updateCard(card, title);
    res.status(200).send(card)
  } catch (error) {
    res.status(error.statusCode).send({ message: error.message })
  }
}
async function deleteCard(req, res) {
  try {
    const card = req.card; 
    await CardServices.deleteCard(card);
    res.status(204).send({ message: 'Delete Card Success!' });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message }) 
  }
}
async function createTask(req, res) {
  try {
    const card = req.card, task = req.body.task;
    const nCard = await CardServices.createTask(card, task);
    res.status(201).send({ message: 'Created New Main Task Success' , nCard});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message});
  }
}
async function deleteTask(req, res) {
  try {
    const card = req.card, taskId = req.params.taskId;
    await CardServices.deleteTask(card, taskId);  
    res.status(204).send({message : 'Delete Task Success'});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message});
  }
}
async function createContentTask(req, res) {
  try {
    const card = req.card, taskId = req.params.taskId, content = req.body.content;
    const nCard = await CardServices.createContentTask(card, taskId, content);
    res.status(201).send({message : 'Create Content Task Success', card : nCard});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message});
  }
}
async function deleteContentTask(req, res, next) {
  try {
    const card = req.card, taskId = req.params.taskId, idx = req.params.idx;
    await CardServices.deleteContentTask(card, taskId, idx);
    res.status(204).send({ message : 'Delete Content Task'});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message});
  }
}

async function addComment(req, res, next) { 
  try {
    const card = req.card, userId = req.user._id, comment = req.body.comment;
    const nCard = await CardServices.addComment(card, userId, comment);
    res.status(201).send({ message : 'Add Comment Success!', card : nCard});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message});
  }
}

async function updateComment(req, res, next) {
  try {
    const card = req.card, comment = req.body.comment, idx = req.params.idx,
          userId = req.user._id;
    const nCard = await CardServices.updateComment(card, userId, idx, comment);
    res.status(200).send({message : 'Update Comment', card : nCard});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message});
  }
}

async function deleteComment(req, res, next) {
  try {
    const { board, card } = req, idx = req.params.idx, userId = req.user._id;
    const nCard = await CardServices.deleteComment(board, card, idx, userId);
    res.status(204).send({message : 'Delete Comment', card : nCard});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message})
  }
}

async function createDueTime(req, res, next) {
  try {
    const dueTime = req.body.dueTime, card = req.card;
    const nCard = await CardServices.createDueTime(card, dueTime);
    res.status(200).send({message : 'Update DueTime Success!', card : nCard});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message});
  }
}

async function deleteDueTime(req, res, next) {
  try {
    const card = req.card;  
    const nCard = await CardServices.deleteDueTime(card);
    res.status(204).send({ message: 'Deleted DueTime' , card : nCard});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message});
  }
}

async function createDescription(req, res, next) {
  try {
    const description = req.body.description, card = req.card;
    const nCard = await CardServices.createDescription(card, description);
    res.status(200).send({ message : 'Update Description' , card : nCard});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message});
  }
}

async function deleteDescription(req, res, next) {
  try {
    const card = req.card;
    const nCard = await CardServices.deleteDescription(card);
    res.status(204).send({ message: 'Deleted Description', card : nCard });
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message});
  }
}

async function changeList(req, res, next) {
  try {
    const card = req.card, listId = req.body.listId;
    const nCard = await CardServices.moveCard(card, listId);
    res.status(200).send({message : 'Change List Success!', card : nCard});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message}) 
  }
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
