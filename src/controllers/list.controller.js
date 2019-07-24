const ListServices = require('../services/list.service');

async function getLists(req, res, next) {
  try {
    const boardId = req.board._id; 
    const lists = await ListServices.getLists(boardId);
    res.status(200).send(lists);
  } catch (error) {
    next(error);
  }
}
async function createList(req, res) {
  try {
    const title = req.body.title , board = req.board;
    await ListServices.createList(board, title);  
    res.status(201).send({ message : 'Create List Success!'});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message});
  }
}
async function updateList(req, res) {
  try {
    const listId = req.params.listId, title = req.body.title;
    const list = await ListServices.updateList(listId, title);
    res.status(200).send(list)
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message})
  }
}

async function deleteList(req, res) {
  try {
    const listId = req.params.listId, board = req.board;
    const list = await ListServices.deleteList(board, listId);  
    res.status(204).send({message : 'List was deleted'});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message})
  }
}
module.exports = {
  getLists,
  createList,
  updateList,
  deleteList
}
