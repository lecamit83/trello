const ListServices = require('../services/list.service');

function getLists(req, res, next) {
  let boardId = req.board._id;

  ListServices.getLists(boardId)
  .then((lists) => res.status(200).send(lists))
  .catch(error => next(error));
}
function createList(req, res, next) {
  let title = req.body.title , board = req.board;

  ListServices.createList(board, title)
  .then(() => res.status(201).send({ message : 'Create List Success!'}))
  .catch((error) => res.status(error.statusCode || 500).send({message : error.message}));
}
function updateList(req, res) {
  const listId = req.params.listId, title = req.body.title;

  ListServices.updateList(listId, title)
  .then(list => res.status(200).send(list))
  .catch(error => res.status(error.statusCode || 500).send({message : error.message}));  
}

function deleteList(req, res, next) {
  let listId = req.params.listId, board = req.board;

  ListServices.deleteList(board, listId)
  .then((list)=>res.status(204).send({message : 'List was deleted'}))
  .catch((error) => res.status(error.statusCode || 500).send({message : error.message}));
}
module.exports = {
  getLists,
  createList,
  updateList,
  deleteList
}
