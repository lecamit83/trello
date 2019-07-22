const List = require('../models/list.model');
const Card = require('../models/card.model');
const ListServices = require('../services/list.service');

const { validateBoard } = require('../validations/board.validation');

function verifyBoard(req, res, next) {
  try {
    const { errors, isValid, board } = validateBoard(req.body);
    if( !isValid ) {
      return res.status(400).send(errors);
    }
    req.board = board;
    next();  
  } catch (error) {
    next(error);
  }
}

function isListExist (req, res, next) {
  const listId = req.params.listId || req.body.listId;
  
  ListServices.isListExist(listId)
  .then(function(list) {
    req.list = list; 
    next();
  })
  .catch((error) => res.status(error.statusCode || 500).send({message : error.message}));
}
async function isCardExist(req, res, next) {
  try {
    let cardId = req.params.cardId ,
        listId = req.body.listId;
    let card = await Card.findOne({ _id : cardId, from : listId });
    if(!card) {
      return res.status(404).send({ message : 'Card Not Found!' });
    }
    req.card = card;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  verifyBoard,
  isListExist,
  isCardExist
}
