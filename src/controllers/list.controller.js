const List = require('../models/list.model');
const { formatTitle } = require('../utils');

async function getLists(req, res, next) {
  try {
    let boardId = req.board._id;
    
    let lists = await List.find({ from : boardId });

    res.status(200).send({lists});
  } catch (error) {
    next(error);
  }
}
async function createList(req, res, next) {
  try {
    let titleList = formatTitle(req.body.title);
    let list = new List({
      title : titleList,
      from : req.board._id
    });
    await list.save();
    res.status(201).send({ message : 'Created New List! '});
  } catch (error) {
    next(error);
  }
}
async function updateList(req, res, next) {
  try {
    let listId = req.params.listId;
    let titleList = formatTitle(req.body.title);
    let list = await List.findById(listId);
    list.title = titleList;
    await list.save();
    res.status(200).send(list);
  } catch (error) {
    next(error);
  }
}

async function deleteList(req, res, next) {
  try {
    let listId = req.params.listId;
    await List.findByIdAndDelete(listId);

    res.status(204).send({ message : 'Delete Success'});
  } catch (error) {
    next(error);
  }
}
module.exports = {
  getLists,
  createList,
  updateList,
  deleteList
}
