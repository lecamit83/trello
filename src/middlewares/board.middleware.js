const Board = require('../models/board.model');
const List = require('../models/list.model');
const { validateBoard } = require('../validations/board.validation');
function verifyBoard(req, res, next) {
  try {
    const { errors, isValid, board } = validateBoard(req.body);
    if( !isValid ) {
      return res.status(400).send(errors);
    }
    board.members.push({ userId : req.user._id, isAdmin : true});
    req.board = board;
    next();  
  } catch (error) {
    next(error);
  }
}

async function verifyList (req, res, next) {
  try {
    let listId = req.params.listId;
    let list = await List.findOne({ _id : listId });
    if(!list) {
      return res.status(404).send({ message : 'List Not Found!' });
    }
    req.list = list;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  verifyBoard,
  verifyList,
}
