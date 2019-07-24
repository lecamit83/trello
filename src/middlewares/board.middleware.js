const ListServices = require('../services/list.service');
const CardServices = require('../services/card.service');

const { validateBoard } = require('../validations/board.validation');

function verifyBoard(req, res, next) {
  try {
    const { errors, isValid, board } = validateBoard(req.body);
    if (!isValid) {
      return res.status(400).send(errors);
    }
    req.board = board;
    next();
  } catch (error) {
    next(error);
  }
}

async function isListExist(req, res, next) {
  const listId = req.params.listId || req.body.listId;

   ListServices.isListExist(listId)
    .then(function (list) {
      req.list = list;
      next();
    })
    .catch((error) => res.status(error.statusCode || 500).send({ message: error.message }));
}
function isCardExist(req, res, next) {
  let cardId = req.params.cardId, listId = req.body.listId;

  CardServices.isCardExist(listId, cardId)
    .then(function (card) {
      req.card = card;
      next();
    })
    .catch((error) => res.status(error.statusCode || 500).send({ message : error.message }));
}

module.exports = {
  verifyBoard,
  isListExist,
  isCardExist
}
