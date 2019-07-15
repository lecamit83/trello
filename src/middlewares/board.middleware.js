const Board = require('../models/board.model');
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



module.exports = {
  verifyBoard,
}
