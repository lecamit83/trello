const List = require('../models/list.model');
const Card = require('../models/card.model');
const { formatTitle } = require('../utils');

async function getLists(req, res, next) {
  try {
    let boardId = req.board._id;
    
    let lists = await List.find({ from : boardId })
      .populate({
        path : 'cards.card',
        select : 'title members dueTime',
        populate : {
          path : 'members.user',
          select : 'name',
        }
      })
      .exec();

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
    let board = req.board;
    board.lists.push({list : list._id});
    await list.save();
    await board.save();
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
    let list = await List.findOne({ _id : listId });
    
    if(!list) { return res.status(404).send('List Not Found!'); }
    let board = req.board;
    board.lists = board.lists.filter(e => e.list.toString() !== listId.toString()); 
    await board.save();
    
    let cards = await Card.find({ from : listId });
    cards.forEach(async function (card) {
      await card.remove();
    });

    await list.remove();
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
