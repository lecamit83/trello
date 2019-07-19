const Card = require('../models/card.model');
const List = require('../models/list.model');
const { validate, validateTitle } = require('../validations/card.validation');
const { isValidDate, isEmpty, isAdmin, isOwner } = require('../utils');
async function createCard(req, res, next) {  
  try {
    const errors = validateTitle(req.body.title);
    if(!errors) return res.status(400).send({ message : errors });
    
    let list = req.list;
    let card = new Card({ title : req.body.title , from : list._id});
    await card.save();

    list.cards.push({card : card._id}); 
    await list.save();
    
    res.status(201).send({message : 'Created Card' , card});
  } catch (error) {
    next(error);
  }
}


async function getCards(req, res, next) {
  try {
    let listId = req.params.listId;
    let cards = await Card.find({ from : listId })
      .populate({
        path : 'members.user',
        select : 'name',
      });
    res.status(200).send({cards});
  } catch (error) {
    next(error);
  }
}

async function getCard(req, res, next) {
  try {
    let cardId = req.params.cardId,
        listId = req.body.listId;

    let card = await Card.findOne({ _id : cardId , from : listId })
      .populate({
        path : 'members.user',
        select : 'name'
      })
      .populate({
        path : 'comments.user',
        select : 'name'
      })
      .exec();
    if(!card) { return res.status(404).send({ members : 'Card Not Found!'});}
    res.status(200).send({card});
  } catch (error) {
    next(error);
  }
}

async function updateCard(req, res, next) {
  try {
    let title = req.body.title || '';
    if(isEmpty(title)) return res.status(400).send({message : 'Title is Empty'});
    
    let cardId = req.params.cardId,
        listId = req.body.listId;
    let updatedCard = await Card.findOne({ _id : cardId , from : listId });
    if(!updatedCard) return res.status(404).send({message : 'Card Not Found!'});
    updatedCard.title = title;
    await updatedCard.save();
    
    res.status(200).send({ card : updatedCard });
  } catch (error) {
    next(error);
  }
}

async function deleteCard(req, res, next) {
  try {
    let cardId = req.params.cardId;
    
    let card = await Card.findById(cardId);
    if(!card) return res.status(404).send({message : 'Card Not Found!'});
    await card.remove();
    
    let list = await List.findOne({ _id : card.from });
    if(!list) {
      return res.status(404).send({ message : 'List Not Found!' });
    }
    list.cards = list.cards.filter(e => e.card.toString() !== cardId.toString());
    await list.save();

    res.status(204).send({message : 'Card was removed!'});
  } catch (error) {
    next(error);
  }
}

async function createdTask(req, res, next) {
  try {
    let task = req.body.task;
    if(!task) return res.status(400).send({ message : 'Empty Task'});
    
    let card = req.card;
    
    card.tasks.push({ title : task , contents : [] });

    await card.save();

    res.status(201).send({ message : 'Created New Main Task Success'});
  } catch (error) {
    next(error);
  }
}
async function deletedTask(req, res, next) {
  try {
    let taskId = req.params.taskId;
   
    let cardId = req.params.cardId;
    let card = await Card.findById(cardId);
    if(!card) return res.status(404).send({ message : 'Card Not Found!'});
    
    card.tasks = card.tasks.filter(function(task){
      return task._id.toString() !== taskId.toString();
    });

    await card.save();

    res.status(204).send({ message : 'Delete Task Success'});
  } catch (error) {
    next(error);
  }
}
async function createdContentTask(req, res, next) {
  try {
    let cardId = req.params.cardId;
    let taskId = req.params.taskId;
    let content = req.body.content;
    
    let card = await Card.findOne({_id : cardId });
   
    if(!card) {
      return res.status(404).send({ message : 'Card Not Found' })
    }
    let task = card.tasks.find(e => e._id.toString() === taskId.toString());
   
    if(!task) return res.status(404).send({message : 'Task Not Found!'});
    task.contents.push(content);

    await card.save();
    res.status(201).send({message : 'Create Task Content'});
  } catch (error) {
    next(error);
  }
}
async function deletedContentTask(req, res, next) {
  try {
    let cardId = req.params.cardId,
        taskId = req.params.taskId,
        idx = req.params.idx;

    let card = await Card.findOne({_id : cardId });
   
    if(!card) {
      return res.status(404).send({ message : 'Card Not Found' })
    }
    let task = card.tasks.find(e => e._id.toString() === taskId.toString());
   
    if(!task) return res.status(404).send({message : 'Task Not Found!'});
    
    task.contents = task.contents.filter(function(content, index){
      if(index.toString() !== idx) return content;
    });

    await card.save();
    res.status(204).send({message : 'Delete Task Content'});
  } catch (error) {
    next(error);
  }
}

async function addComment(req, res, next) {
  try {
    let comment = req.body.comment,
        user = req.user._id,
        card = req.card;
    card.comments.push({user, comment});
    await card.save();

    res.status(201).send({message : 'Add Comment Success'});
  } catch (error) {
    next(error);
  }
}

async function updatedComment(req, res, next) {
 
  try {
    let idx = req.params.idx,
        comment = req.body.comment || '';
        
    const {board, card} = req;

    if(isNaN(idx)) {return res.status(400).send({message : 'Invalid Number!'});}
    
    index = Number.parseInt(idx);

    if(index > card.comments.length || index < 0) { return res.status(404).send({message : 'Card Not Found!'});}
    // check is own's comment or admin board
    let userId = req.user._id;
    if(!isOwner(card.comments[index].user , userId) || !isAdmin(board.members, userId)) {
      return res.status(403).send({message : 'Forbidden'});
    }

    card.comments[idx].comment = comment;

    await card.save();

    res.status(200).send({ message : 'Update Comment Success'});

  } catch (error) {
    next(error);
  }
}

async function deletedComment(req, res, next) {
  try {
    let idx = req.params.idx;
    const {board, card} = req;

    let userId = req.user._id;
    if(!isAdmin(board.membersm, userId)) {
      return res.status(403).send({message : 'Forbidden'});
    }

    card.comments = card.comments.filter(function(message , index) {
      if(index.toString() !== idx) return message;
    });
    
    await card.save();

    res.status(204).send({message : 'Delete Comment Success'});
  } catch (error) {
    next(error);
  }
}

async function createdDueTime(req, res, next) {
  try {
    let dueTime = req.body.dueTime;
  
    if(!isValidDate(dueTime.toString())) {
      return res.status(400).send({ message: 'Invalid Date, format : mm/dd/yyyy'});
    }
    
    let card = req.card;
    let statusCode, message;
    
    if(!card.dueTime) {
      statusCode = 201; message = 'Create Due Time success!';
    }else {
      statusCode = 200; message = 'Update Due Time success!';
    }
    
    card.dueTime = dueTime;
    await card.save();
    res.status(statusCode).send({ message });
  
  } catch (error) {
    next(error);
  }
}

async function deletedDueTime(req, res, next) {
  try {
    let card = req.card;
    card.dueTime = undefined;
    await card.save();
    res.status(204).send({message : 'Deleted DueTime'});
  } catch (error) {
    next(error);
  }
}

async function createdDescription(req, res, next) {
  try {
    let description = req.body.description || '';
    if(isEmpty(description)) { return res.status(400).send({ message : 'Description is Empty!' }); }
    
    if(!req.card.description) {
      statusCode = 201; message = 'Create Description success!';
    }else {
      statusCode = 200; message = 'Update Description success!';
    }
    req.card.description = description;
    await req.card.save();

    res.status(statusCode).send({ message });
  } catch (error) {
    next(error);
  }
}

async function deletedDescription(req, res, next) {
  try {
    let card = req.card;
    card.description = undefined;
    await card.save();
    res.status(204).send({message : 'Deleted Description'});
  } catch (error) {
    next(error);
  }
}

async function changeList (req, res, next) {
  try {
    let listId = req.body.listId;

    let newList = await List.findOne({ _id : listId });
    if(!newList) { return res.status(404).send({ message : 'List Not Found!'}); }
    
    let card = req.card;
    
    let oldList = await List.findOne({ _id : card.from });
    if(!oldList) { return res.status(404).send({ message : 'List was Removed Before!'}); }
    
    card.from = listId;
    oldList.cards = oldList.cards.filter(function(e) {
      return e.card.toString() === card._id.toString();
    });
    newList.cards.push({card : card._id});

    await card.save();
    await oldList.save();
    await newList.save();
    res.status(200).send({message : 'Change List'});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCard,
  getCards,
  getCard,
  updateCard,
  deleteCard,
  addComment,
  deletedComment,
  updatedComment,
  createdTask,
  deletedTask,
  createdContentTask,
  deletedContentTask,
  createdDueTime,
  deletedDueTime,
  createdDescription,
  deletedDescription,
  changeList
}
